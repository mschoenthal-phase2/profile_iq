-- Sample Clinical Expertise Data
-- This file contains sample data for testing the medical expertise functionality
-- In production, this would be populated from the comprehensive CSV data provided

-- Insert sample clinical expertise data
INSERT INTO clinical_expertise (term_id, term, specialty, term_type, specialty_id) VALUES

-- Cardiology
('CARD_C001', 'Coronary Artery Disease', 'Cardiology', 'Condition', 1),
('CARD_C002', 'Heart Failure', 'Cardiology', 'Condition', 1),
('CARD_C003', 'Atrial Fibrillation', 'Cardiology', 'Condition', 1),
('CARD_C004', 'Myocardial Infarction', 'Cardiology', 'Condition', 1),
('CARD_C005', 'Hypertensive Heart Disease', 'Cardiology', 'Condition', 1),
('CARD_C006', 'Cardiomyopathy', 'Cardiology', 'Condition', 1),
('CARD_C007', 'Valvular Heart Disease', 'Cardiology', 'Condition', 1),
('CARD_P001', 'Cardiac Catheterization', 'Cardiology', 'Procedure', 1),
('CARD_P002', 'Echocardiogram', 'Cardiology', 'Procedure', 1),
('CARD_P003', 'Stress Test', 'Cardiology', 'Procedure', 1),
('CARD_P004', 'Holter Monitor', 'Cardiology', 'Procedure', 1),
('CARD_P005', 'Angioplasty', 'Cardiology', 'Procedure', 1),
('CARD_R001', 'Chest Pain', 'Cardiology', 'Reason for Visit', 1),
('CARD_R002', 'Palpitations', 'Cardiology', 'Reason for Visit', 1),
('CARD_R003', 'Shortness of Breath', 'Cardiology', 'Reason for Visit', 1),
('CARD_R004', 'Cardiac Follow-up', 'Cardiology', 'Reason for Visit', 1),

-- Family Medicine
('FAM_C001', 'Diabetes Mellitus Type 2', 'Family Medicine', 'Condition', 4),
('FAM_C002', 'Hypertension', 'Family Medicine', 'Condition', 4),
('FAM_C003', 'Upper Respiratory Infection', 'Family Medicine', 'Condition', 4),
('FAM_C004', 'Obesity', 'Family Medicine', 'Condition', 4),
('FAM_C005', 'Depression', 'Family Medicine', 'Condition', 4),
('FAM_C006', 'Anxiety Disorders', 'Family Medicine', 'Condition', 4),
('FAM_C007', 'Hyperlipidemia', 'Family Medicine', 'Condition', 4),
('FAM_C008', 'Osteoarthritis', 'Family Medicine', 'Condition', 4),
('FAM_P001', 'Annual Physical Exam', 'Family Medicine', 'Procedure', 4),
('FAM_P002', 'Immunizations', 'Family Medicine', 'Procedure', 4),
('FAM_P003', 'Blood Pressure Monitoring', 'Family Medicine', 'Procedure', 4),
('FAM_P004', 'Glucose Testing', 'Family Medicine', 'Procedure', 4),
('FAM_P005', 'Preventive Counseling', 'Family Medicine', 'Procedure', 4),
('FAM_R001', 'Routine Checkup', 'Family Medicine', 'Reason for Visit', 4),
('FAM_R002', 'Fever', 'Family Medicine', 'Reason for Visit', 4),
('FAM_R003', 'Medication Management', 'Family Medicine', 'Reason for Visit', 4),
('FAM_R004', 'Health Maintenance', 'Family Medicine', 'Reason for Visit', 4),

-- Dermatology
('DERM_C001', 'Acne Vulgaris', 'Dermatology', 'Condition', 2),
('DERM_C002', 'Eczema', 'Dermatology', 'Condition', 2),
('DERM_C003', 'Psoriasis', 'Dermatology', 'Condition', 2),
('DERM_C004', 'Skin Cancer', 'Dermatology', 'Condition', 2),
('DERM_C005', 'Melanoma', 'Dermatology', 'Condition', 2),
('DERM_C006', 'Rosacea', 'Dermatology', 'Condition', 2),
('DERM_P001', 'Skin Biopsy', 'Dermatology', 'Procedure', 2),
('DERM_P002', 'Cryotherapy', 'Dermatology', 'Procedure', 2),
('DERM_P003', 'Mole Removal', 'Dermatology', 'Procedure', 2),
('DERM_P004', 'Laser Treatment', 'Dermatology', 'Procedure', 2),
('DERM_R001', 'Skin Rash', 'Dermatology', 'Reason for Visit', 2),
('DERM_R002', 'Mole Check', 'Dermatology', 'Reason for Visit', 2),
('DERM_R003', 'Acne Treatment', 'Dermatology', 'Reason for Visit', 2),

-- Pediatrics
('PED_C001', 'Asthma', 'Pediatrics', 'Condition', 10),
('PED_C002', 'ADHD', 'Pediatrics', 'Condition', 10),
('PED_C003', 'Otitis Media', 'Pediatrics', 'Condition', 10),
('PED_C004', 'Bronchiolitis', 'Pediatrics', 'Condition', 10),
('PED_C005', 'Developmental Delays', 'Pediatrics', 'Condition', 10),
('PED_P001', 'Well Child Visit', 'Pediatrics', 'Procedure', 10),
('PED_P002', 'Childhood Immunizations', 'Pediatrics', 'Procedure', 10),
('PED_P003', 'Growth Assessment', 'Pediatrics', 'Procedure', 10),
('PED_P004', 'Developmental Screening', 'Pediatrics', 'Procedure', 10),
('PED_R001', 'Developmental Concerns', 'Pediatrics', 'Reason for Visit', 10),
('PED_R002', 'Behavioral Issues', 'Pediatrics', 'Reason for Visit', 10),
('PED_R003', 'Routine Care', 'Pediatrics', 'Reason for Visit', 10),

-- Internal Medicine
('IM_C001', 'Chronic Kidney Disease', 'Internal Medicine', 'Condition', 5),
('IM_C002', 'COPD', 'Internal Medicine', 'Condition', 5),
('IM_C003', 'Pneumonia', 'Internal Medicine', 'Condition', 5),
('IM_C004', 'Anemia', 'Internal Medicine', 'Condition', 5),
('IM_C005', 'Thyroid Disorders', 'Internal Medicine', 'Condition', 5),
('IM_P001', 'Comprehensive Exam', 'Internal Medicine', 'Procedure', 5),
('IM_P002', 'EKG', 'Internal Medicine', 'Procedure', 5),
('IM_P003', 'Pulmonary Function Test', 'Internal Medicine', 'Procedure', 5),
('IM_R001', 'Complex Medical Management', 'Internal Medicine', 'Reason for Visit', 5),
('IM_R002', 'Multiple Comorbidities', 'Internal Medicine', 'Reason for Visit', 5),

-- Neurology
('NEURO_C001', 'Migraine', 'Neurology', 'Condition', 6),
('NEURO_C002', 'Epilepsy', 'Neurology', 'Condition', 6),
('NEURO_C003', 'Stroke', 'Neurology', 'Condition', 6),
('NEURO_C004', 'Parkinson Disease', 'Neurology', 'Condition', 6),
('NEURO_C005', 'Multiple Sclerosis', 'Neurology', 'Condition', 6),
('NEURO_P001', 'EEG', 'Neurology', 'Procedure', 6),
('NEURO_P002', 'EMG', 'Neurology', 'Procedure', 6),
('NEURO_P003', 'Nerve Conduction Study', 'Neurology', 'Procedure', 6),
('NEURO_R001', 'Headache', 'Neurology', 'Reason for Visit', 6),
('NEURO_R002', 'Seizure', 'Neurology', 'Reason for Visit', 6),
('NEURO_R003', 'Neurological Symptoms', 'Neurology', 'Reason for Visit', 6),

-- Orthopedic Surgery
('ORTHO_C001', 'Fractures', 'Orthopedic Surgery', 'Condition', 9),
('ORTHO_C002', 'Knee Osteoarthritis', 'Orthopedic Surgery', 'Condition', 9),
('ORTHO_C003', 'Rotator Cuff Tear', 'Orthopedic Surgery', 'Condition', 9),
('ORTHO_C004', 'Spinal Stenosis', 'Orthopedic Surgery', 'Condition', 9),
('ORTHO_P001', 'Joint Replacement', 'Orthopedic Surgery', 'Procedure', 9),
('ORTHO_P002', 'Arthroscopy', 'Orthopedic Surgery', 'Procedure', 9),
('ORTHO_P003', 'Fracture Repair', 'Orthopedic Surgery', 'Procedure', 9),
('ORTHO_R001', 'Joint Pain', 'Orthopedic Surgery', 'Reason for Visit', 9),
('ORTHO_R002', 'Sports Injury', 'Orthopedic Surgery', 'Reason for Visit', 9),

-- Emergency Medicine
('EM_C001', 'Acute Myocardial Infarction', 'Emergency Medicine', 'Condition', 3),
('EM_C002', 'Trauma', 'Emergency Medicine', 'Condition', 3),
('EM_C003', 'Sepsis', 'Emergency Medicine', 'Condition', 3),
('EM_C004', 'Overdose', 'Emergency Medicine', 'Condition', 3),
('EM_P001', 'Resuscitation', 'Emergency Medicine', 'Procedure', 3),
('EM_P002', 'Intubation', 'Emergency Medicine', 'Procedure', 3),
('EM_P003', 'Central Line Placement', 'Emergency Medicine', 'Procedure', 3),
('EM_R001', 'Chest Pain', 'Emergency Medicine', 'Reason for Visit', 3),
('EM_R002', 'Abdominal Pain', 'Emergency Medicine', 'Reason for Visit', 3),
('EM_R003', 'Trauma Evaluation', 'Emergency Medicine', 'Reason for Visit', 3),

-- Psychiatry
('PSY_C001', 'Major Depressive Disorder', 'Psychiatry', 'Condition', 11),
('PSY_C002', 'Bipolar Disorder', 'Psychiatry', 'Condition', 11),
('PSY_C003', 'Anxiety Disorders', 'Psychiatry', 'Condition', 11),
('PSY_C004', 'Schizophrenia', 'Psychiatry', 'Condition', 11),
('PSY_P001', 'Psychiatric Evaluation', 'Psychiatry', 'Procedure', 11),
('PSY_P002', 'Psychotherapy', 'Psychiatry', 'Procedure', 11),
('PSY_P003', 'Medication Management', 'Psychiatry', 'Procedure', 11),
('PSY_R001', 'Depression', 'Psychiatry', 'Reason for Visit', 11),
('PSY_R002', 'Anxiety', 'Psychiatry', 'Reason for Visit', 11),
('PSY_R003', 'Mood Disorders', 'Psychiatry', 'Reason for Visit', 11),

-- Obstetrics & Gynecology
('OBGYN_C001', 'Pregnancy', 'Obstetrics & Gynecology', 'Condition', 7),
('OBGYN_C002', 'Menstrual Disorders', 'Obstetrics & Gynecology', 'Condition', 7),
('OBGYN_C003', 'Endometriosis', 'Obstetrics & Gynecology', 'Condition', 7),
('OBGYN_C004', 'Ovarian Cysts', 'Obstetrics & Gynecology', 'Condition', 7),
('OBGYN_P001', 'Prenatal Care', 'Obstetrics & Gynecology', 'Procedure', 7),
('OBGYN_P002', 'Pap Smear', 'Obstetrics & Gynecology', 'Procedure', 7),
('OBGYN_P003', 'Ultrasound', 'Obstetrics & Gynecology', 'Procedure', 7),
('OBGYN_R001', 'Routine Gynecologic Exam', 'Obstetrics & Gynecology', 'Reason for Visit', 7),
('OBGYN_R002', 'Pregnancy Visit', 'Obstetrics & Gynecology', 'Reason for Visit', 7),

-- Oncology
('ONC_C001', 'Breast Cancer', 'Oncology', 'Condition', 8),
('ONC_C002', 'Lung Cancer', 'Oncology', 'Condition', 8),
('ONC_C003', 'Colorectal Cancer', 'Oncology', 'Condition', 8),
('ONC_C004', 'Lymphoma', 'Oncology', 'Condition', 8),
('ONC_P001', 'Chemotherapy', 'Oncology', 'Procedure', 8),
('ONC_P002', 'Radiation Therapy', 'Oncology', 'Procedure', 8),
('ONC_P003', 'Biopsy', 'Oncology', 'Procedure', 8),
('ONC_R001', 'Cancer Treatment', 'Oncology', 'Reason for Visit', 8),
('ONC_R002', 'Cancer Follow-up', 'Oncology', 'Reason for Visit', 8),

-- Radiology
('RAD_C001', 'Imaging Findings', 'Radiology', 'Condition', 12),
('RAD_P001', 'CT Scan', 'Radiology', 'Procedure', 12),
('RAD_P002', 'MRI', 'Radiology', 'Procedure', 12),
('RAD_P003', 'X-Ray', 'Radiology', 'Procedure', 12),
('RAD_P004', 'Ultrasound', 'Radiology', 'Procedure', 12),
('RAD_R001', 'Diagnostic Imaging', 'Radiology', 'Reason for Visit', 12),

-- Surgery
('SURG_C001', 'Appendicitis', 'Surgery', 'Condition', 13),
('SURG_C002', 'Gallbladder Disease', 'Surgery', 'Condition', 13),
('SURG_C003', 'Hernia', 'Surgery', 'Condition', 13),
('SURG_P001', 'Laparoscopic Surgery', 'Surgery', 'Procedure', 13),
('SURG_P002', 'Open Surgery', 'Surgery', 'Procedure', 13),
('SURG_P003', 'Appendectomy', 'Surgery', 'Procedure', 13),
('SURG_R001', 'Surgical Consultation', 'Surgery', 'Reason for Visit', 13),
('SURG_R002', 'Pre-operative Evaluation', 'Surgery', 'Reason for Visit', 13),

-- Urology
('URO_C001', 'Kidney Stones', 'Urology', 'Condition', 14),
('URO_C002', 'Prostate Cancer', 'Urology', 'Condition', 14),
('URO_C003', 'Urinary Incontinence', 'Urology', 'Condition', 14),
('URO_P001', 'Cystoscopy', 'Urology', 'Procedure', 14),
('URO_P002', 'Prostatectomy', 'Urology', 'Procedure', 14),
('URO_P003', 'Lithotripsy', 'Urology', 'Procedure', 14),
('URO_R001', 'Urinary Problems', 'Urology', 'Reason for Visit', 14),
('URO_R002', 'Prostate Issues', 'Urology', 'Reason for Visit', 14);

-- Note: In production, this would be populated from the comprehensive CSV data
-- provided by the user with hundreds or thousands of entries per specialty
