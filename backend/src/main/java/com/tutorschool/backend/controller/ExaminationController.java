package com.tutorschool.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tutorschool.backend.model.Examination;
import com.tutorschool.backend.service.ExaminationService;

@RestController
@RequestMapping("/api/examinations")
@CrossOrigin(origins = "*")
public class ExaminationController {

    private final ExaminationService examinationService;

    public ExaminationController(ExaminationService examinationService) {
        this.examinationService = examinationService;
    }

    @GetMapping
    public List<Examination> getAll() {
        return examinationService.getAll();
    }

    @GetMapping("/{id}")
    public Examination getById(@PathVariable Long id) {
        return examinationService.getById(id);
    }

    @PostMapping(consumes = "multipart/form-data")
    public Examination create(
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        Examination examination = convertJsonToExamination(data);
        return examinationService.create(examination, image);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public Examination update(
            @PathVariable Long id,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        Examination examination = convertJsonToExamination(data);
        return examinationService.update(id, examination, image);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        examinationService.delete(id);
        return "ลบข้อมูลสถาบันสอบเรียบร้อยแล้ว";
    }

    private Examination convertJsonToExamination(String data) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> map = parser.parseMap(data);

        Examination examination = new Examination();
        examination.setNameTh((String) map.get("nameTh"));
        examination.setNameEn((String) map.get("nameEn"));
        examination.setCode((String) map.get("code"));
        examination.setType((String) map.get("type"));
        examination.setStatus((String) map.get("status"));
        examination.setAddress((String) map.get("address"));
        examination.setDistrict((String) map.get("district"));
        examination.setAmphoe((String) map.get("amphoe"));
        examination.setProvince((String) map.get("province"));
        examination.setZipcode((String) map.get("zipcode"));
        examination.setContactName((String) map.get("contactName"));
        examination.setRegDate((String) map.get("regDate"));

        Object totalSeats = map.get("totalSeats");
        if (totalSeats != null) {
            examination.setTotalSeats(Integer.parseInt(totalSeats.toString()));
        }

        return examination;
    }
}