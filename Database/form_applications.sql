CREATE TABLE `access_requests` (
  `id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--*********************
--*********************

CREATE TABLE `admin_logs` (
  `id` int NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `action` varchar(50) NOT NULL,
  `application_unique_id` varchar(20) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--*********************
--*********************

CREATE TABLE `applications` (
  `id` int NOT NULL,
  `unique_id` varchar(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `time_of_birth` varchar(20) DEFAULT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `height` varchar(50) DEFAULT NULL,
  `birth_star` varchar(100) DEFAULT NULL,
  `zodiac_sign` varchar(100) DEFAULT NULL,
  `gothram` varchar(100) DEFAULT NULL,
  `current_living` varchar(255) DEFAULT NULL,
  `educational_details` text,
  `designation` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `previous_work_experience` text,
  `fathers_name` varchar(255) DEFAULT NULL,
  `fathers_father_name` varchar(255) DEFAULT NULL,
  `mothers_name` varchar(255) DEFAULT NULL,
  `mothers_father_name` varchar(255) DEFAULT NULL,
  `siblings` text,
  `email_id` varchar(255) DEFAULT NULL,
  `contact_no1` varchar(50) DEFAULT NULL,
  `contact_no2` varchar(50) DEFAULT NULL,
  `main_photo_url` text,
  `side_photo_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--*********************
--*********************

CREATE TABLE `visitors` (
  `id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Indexes for table `access_requests`
--
ALTER TABLE `access_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_requests`
--
ALTER TABLE `access_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;
