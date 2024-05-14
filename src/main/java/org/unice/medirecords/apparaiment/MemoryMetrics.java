package org.unice.medirecords.apparaiment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemoryMetrics {
    private long totalMemory;
    private long freeMemory;
    private long usedMemory;

    public MemoryMetrics(long totalMemory, long freeMemory, long usedMemory) {
        this.totalMemory = totalMemory;
        this.freeMemory = freeMemory;
        this.usedMemory = usedMemory;
    }

    // Getters et setters...
}