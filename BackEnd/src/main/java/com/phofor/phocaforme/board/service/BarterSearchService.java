package com.phofor.phocaforme.board.service;


import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.board.dto.IdolMemberDto;
import com.phofor.phocaforme.board.dto.searchDto.BarterDocument;
import com.phofor.phocaforme.board.dto.searchDto.WishDocument;
import com.phofor.phocaforme.board.dto.searchDto.criteria.BarterSearchCriteria;
import com.phofor.phocaforme.board.dto.searchDto.request.SearchRequest;
import com.phofor.phocaforme.board.dto.searchDto.response.SearchResponse;
import com.phofor.phocaforme.board.repository.BarterSearchRepository;
import com.phofor.phocaforme.board.service.criteria.BarterCriteriaBuilder;
import com.phofor.phocaforme.board.service.criteria.BarterCriteriaDirector;
import com.phofor.phocaforme.board.service.query.queryBuilder.QueryBuilder;
import com.phofor.phocaforme.board.service.query.queryBuilder.WishQueryBuilder;
import com.phofor.phocaforme.gps.dto.GpsLocationDto;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.SearchPage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
@Slf4j
public class BarterSearchService {
    private static final int EARTH_RADIUS_KM = 6371;
    private final QueryBuilder queryBuilder;
    private final WishQueryBuilder wishQueryBuilder;
    private final BarterSearchRepository barterSearchRepository;
    private final RedisService redisService;

    public List<String> wishPhoca(String title, List<IdolMemberDto> idols){
        wishQueryBuilder.createQuery(title,idols);
        NativeQuery query = wishQueryBuilder.getSearch();
        SearchHits<WishDocument> searchHits = barterSearchRepository.findByTitleAndIdols(query);
        SearchPage<WishDocument> searchPage = SearchHitSupport.searchPageFor(
                searchHits,
                queryBuilder.getPageRequest()
        );
        Iterator<SearchHit<WishDocument>> iterator = searchPage.iterator();
        List<String> ids = new ArrayList<>();
        while(iterator.hasNext()) {
            WishDocument document = iterator.next().getContent();
            ids.add(document.getUserId());
        }
        return ids;
    }

    public List<SearchResponse> searchAll(){
        Sort sort = Sort.by(Sort.Direction.DESC, "created_at");
        Iterable<BarterDocument> iterable = barterSearchRepository.findAll(sort);
//        for (BarterDocument barterDocument : iterable) {
//            System.out.println(barterDocument);
//        }
        return StreamSupport.stream(iterable.spliterator(), false)
                .map(this::convertToSearchResponse)
                .collect(Collectors.toList());
    }

    public List<SearchResponse> search(SearchRequest searchRequest){

        /* A's target is B's own. So exchange them for search. */
        List<Long> temp = searchRequest.getOwn();
        searchRequest.setOwn(searchRequest.getTarget());
        searchRequest.setTarget(temp);

        /* Build Criteria for Query. */
        BarterCriteriaBuilder builder = new BarterCriteriaBuilder(searchRequest);
        BarterCriteriaDirector director = new BarterCriteriaDirector(builder);
        director.buildCriteria();
        BarterSearchCriteria criteria = director.getCriteria();

        /* Build Query by Criteria */
        queryBuilder.createQuery(criteria);
        NativeQuery searchQuery = queryBuilder.getSearch();

        /* Call repository method and Pagination */
        SearchHits<BarterDocument> searchHits = barterSearchRepository.findByOptions(searchQuery);
        SearchPage<BarterDocument> searchPage = SearchHitSupport.searchPageFor(
                searchHits,
                queryBuilder.getPageRequest()
        );
        log.info(">>> hits : "+searchPage.getSearchHits().getTotalHits());
        log.info(searchPage.getContent().toString());

        /* SearchPage<Barter> -> List<SearchResponse> and Return */
        Iterator<SearchHit<BarterDocument>> iterator = searchPage.iterator();
        List<SearchResponse> results = new ArrayList<>();
        while(iterator.hasNext()){
            BarterDocument barter = iterator.next().getContent();
            /* Select article near 2km from user */
            Double distance = checkDistance(barter,searchRequest.getLocationDto());
            if(distance>2){
                continue;
            }

            results.add(new SearchResponse(
                    barter.getArticleId(),
                    barter.getImageUrl(),
                    barter.getTitle(),
                    barter.getOwnMember(),
                    barter.getTargetMember(),
                    barter.isBartered(),
                    distance
            ));
        }
        return results;
    }


    private SearchResponse convertToSearchResponse(BarterDocument document) {
        // BarterDocument를 SearchResponse 객체로 변환하는 로직
        // 필요한 필드를 매핑하여 새로운 SearchResponse 객체 생성
        return new SearchResponse(
                document.getArticleId(),
                document.getImageUrl(),
                document.getTitle(),
                document.getOwnMember(), // 이 필드는 BarterDocument에 적절히 정의되어 있어야 함
                document.getTargetMember(), // 마찬가지로 BarterDocument에 정의되어 있어야 함
                document.isBartered(),
                null
        );
    }


    public static double calculateDistanceInKilometer(double lat1, double lon1, double lat2, double lon2) {
        // 위도, 경도를 라디안으로 변환
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        // 허버사인 공식 사용
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    public Double checkDistance(BarterDocument barter,GpsLocationDto gpsLocationDto){
        Map<String,Double> writerGPS = redisService.getGpsData(barter.getWriterId());

        Double writerLatitude = writerGPS.get("latitude");
        Double writerLongitude = writerGPS.get("longitude");
        Double searcherLatitude = gpsLocationDto.getLatitude();
        Double searcherLongitude = gpsLocationDto.getLongitude();

        return calculateDistanceInKilometer(
                writerLatitude,writerLongitude,
                searcherLatitude,searcherLongitude);
    }

//    public ResponseEntity<List<SearchResponse>> findByOptions(SearchRequest searchRequest) {
//        SearchResponse searchResponse = barterRepository.findByOptions(searchRequest);
//    }
}
