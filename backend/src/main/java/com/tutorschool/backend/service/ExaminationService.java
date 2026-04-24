package com.tutorschool.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tutorschool.backend.model.Examination;
import com.tutorschool.backend.repository.ExaminationRepository;

@Service
public class ExaminationService {

    private final ExaminationRepository examinationRepository;
    private final FileStorageService fileStorageService;

    public ExaminationService(
            ExaminationRepository examinationRepository,
            FileStorageService fileStorageService
    ) {
        this.examinationRepository = examinationRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<Examination> getAll() {
        return examinationRepository.findAll();
    }

    public Examination getById(Long id) {
        return examinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลสถาบันสอบ"));
    }

    public Examination create(Examination examination, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imageName = fileStorageService.storeFile(image);
            examination.setImageName(imageName);
        }

        return examinationRepository.save(examination);
    }

    public Examination update(Long id, Examination data, MultipartFile image) {
        Examination old = getById(id);

        old.setNameTh(data.getNameTh());
        old.setNameEn(data.getNameEn());
        old.setCode(data.getCode());
        old.setType(data.getType());
        old.setStatus(data.getStatus());
        old.setAddress(data.getAddress());
        old.setDistrict(data.getDistrict());
        old.setAmphoe(data.getAmphoe());
        old.setProvince(data.getProvince());
        old.setZipcode(data.getZipcode());
        old.setContactName(data.getContactName());
        old.setRegDate(data.getRegDate());
        old.setTotalSeats(data.getTotalSeats());

        if (image != null && !image.isEmpty()) {
            String imageName = fileStorageService.storeFile(image);
            old.setImageName(imageName);
        }

        return examinationRepository.save(old);
    }

    public void delete(Long id) {
        examinationRepository.deleteById(id);
    }
}