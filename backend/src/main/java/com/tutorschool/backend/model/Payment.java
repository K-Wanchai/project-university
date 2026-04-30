package com.tutorschool.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment")

public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String studentId;
    private String profileUrl;

    private String courseName;
    private String courseId;

    private Double amount;
    private String method;
    private String slipUrl;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String adminRemark;

    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public Payment(){

    }

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();

        if(paymentDate == null){
            paymentDate = LocalDateTime.now();
        }
        if(status == null){
            status = "WAIT_VERIFY";
        }    
    }


    @PreUpdate
    protected void onUpdate(){
        updateAt = LocalDateTime.now();
    }

    public Long getId(){
        return id;
    }

    public String getStudentName(){
        return studentName;
    }

    public void setStudentName(String studentName){
        this.studentName = studentName;
    }

    public String getStudentId(){
        return studentId;
    }

    public void setStudentId(String studentId){
        this.studentId = studentId;
    }

    public String getProfileUrl(){
        return profileUrl;
    }

    public void setProfileUrl(String profileUrl){
        this.profileUrl = profileUrl;
        
    }

    public String getCourseName(){
        return courseName;
    }

    public void setCourseName(String courseName){
        this.courseName = courseName;
    }

    public String getCourseId(){
        return courseId;
    }

    public void setCourseId(String courseId){
        this.courseId = courseId;
    }

    public Double getAmount(){
        return amount;
    }

    public void setAmount(Double amount){
        this.amount = amount;
    }

    public String getMethod(){
        return method;
    }

    public void setMethod(String method){
        this.method = method;
    }

    public String getSlipUrl(){
        return slipUrl;
    }

    public void setSlipUrl(String slipUrl){
        this.slipUrl = slipUrl;
    }

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public String getAdminRemark(){
        return adminRemark;
    }

    public void setAdminRemark(String addminRemark){
        this.adminRemark = addminRemark;
    }

    public LocalDateTime getPaymentDate(){
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate){
        this.paymentDate = paymentDate;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public LocalDateTime getUpdatedAt(){
        return updateAt;
    }

}
