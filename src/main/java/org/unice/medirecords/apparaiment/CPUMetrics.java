package org.unice.medirecords.apparaiment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CPUMetrics {
    private double cpuUsage;

    public CPUMetrics(double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    // Getters et setters...
}