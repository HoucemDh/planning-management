package com.example.hikmaproject.Models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AnalysisResult {
    private String recommendedAction;
    private String analysis;
    private double confidence;

    public AnalysisResult(String recommendedAction, String analysis) {
        this.recommendedAction = recommendedAction;
        this.analysis = analysis;
        this.confidence = 0.0;
    }

     public AnalysisResult(
      @JsonProperty("recommendedAction") String recommendedAction,
      @JsonProperty("analysis")          String analysis,
      @JsonProperty("confidence")        double confidence
    ) {
        this.recommendedAction = recommendedAction;
        this.analysis          = analysis;
        this.confidence        = confidence;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public String getAnalysis() {
        return analysis;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }
}
