package com.phofor.phocaforme.board.repository;

import com.phofor.phocaforme.board.dto.searchDto.BarterDocument;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHits;

public interface MyCustomRepository {
    SearchHits<BarterDocument> findByOptions(NativeQuery searchQuery);
}
