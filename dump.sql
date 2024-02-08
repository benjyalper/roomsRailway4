-- CREATE DATABASE command
CREATE DATABASE IF NOT EXISTS rooms1234;

-- USE command
USE rooms1234;

-- Rest of your MySQL dump file content...

--
-- Table structure for table `selected_dates`
--

DROP TABLE IF EXISTS `selected_dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `selected_dates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `selected_date` date DEFAULT NULL,
  `names` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `roomNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selected_dates`
--

LOCK TABLES `selected_dates` WRITE;
/*!40000 ALTER TABLE `selected_dates` DISABLE KEYS */;
INSERT INTO `selected_dates` VALUES (1,'2024-01-21',NULL,NULL,NULL,NULL,NULL),(2,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(3,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(4,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(5,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(6,'2024-01-10',NULL,NULL,NULL,NULL,NULL),(7,'2024-01-17',NULL,NULL,NULL,NULL,NULL),(8,'2024-01-08',NULL,NULL,NULL,NULL,NULL),(9,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(10,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(11,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(12,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(13,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(14,'2024-01-23',NULL,NULL,NULL,NULL,NULL),(15,'2024-01-01',NULL,NULL,NULL,NULL,NULL),(16,'2024-01-28',NULL,NULL,NULL,NULL,NULL),(17,'2024-01-29',NULL,NULL,NULL,NULL,NULL),(18,'2024-01-23',NULL,NULL,NULL,NULL,NULL),(19,'2024-01-07',NULL,NULL,NULL,NULL,NULL),(20,'2024-01-22',NULL,NULL,NULL,NULL,NULL),(21,'2024-01-16','benjy, adar, yahav, ifat',NULL,NULL,NULL,NULL),(22,'2024-06-27','Adar',NULL,NULL,NULL,NULL),(23,'2024-04-27','Adar',NULL,NULL,NULL,NULL),(24,'2024-01-01','benjy',NULL,NULL,NULL,NULL),(25,'2024-01-01','benjy','pink',NULL,NULL,NULL),(26,'2024-01-02','benjy','pink',NULL,NULL,NULL),(27,'2024-01-28','yahav','pink',NULL,NULL,NULL),(28,'2024-01-23','adar',NULL,NULL,NULL,NULL),(29,'2024-01-30','yahav, adar',NULL,NULL,NULL,NULL),(30,'2024-01-15','lodye','#28a9a7',NULL,NULL,NULL),(31,'2024-01-17','benjy','#e70d0d',NULL,NULL,NULL),(32,'2024-10-15','benjy','#e70d0d',NULL,NULL,NULL),(33,'2024-01-10','lllllllllll','#3063b5',NULL,NULL,NULL),(34,'2024-01-09','osooodsd','#4b5b10',NULL,NULL,NULL),(35,'2024-06-04','benjy','#18fbf8',NULL,NULL,NULL),(36,'2024-01-30','ifat','#8c24f5','18:50:00','21:53:00',NULL),(37,'2024-08-30','ifat','#8c24f5','18:50:00','21:53:00',NULL),(38,'2024-08-27','ifat','#c60cdf','18:53:00','20:52:00',NULL),(39,'2024-09-25','ifat','#307e35','19:10:00','23:57:00',NULL),(40,'2024-12-25','yaniv','#bdef0b','05:56:00','08:59:00',NULL),(41,'2024-07-26','benjy','#123ff3','22:05:00','23:05:00',NULL),(42,'2024-01-10','cohen','#17037c','00:10:00','02:10:00',NULL),(43,'2024-05-21','cohen','#ba5e8b','00:10:00','02:10:00',NULL),(44,'2024-01-16','benjy','#e10e0e','01:11:00','03:11:00',NULL),(45,'2024-06-12','benjy','#a635d0','01:11:00','03:11:00',NULL),(46,'2024-11-01','benjy','#7c8415','01:24:00','03:24:00',NULL),(47,'2024-11-06','יהב','#e26acc','01:26:00','23:30:00',NULL),(48,NULL,NULL,NULL,NULL,NULL,NULL),(49,NULL,NULL,NULL,NULL,NULL,NULL),(51,NULL,NULL,NULL,'09:00:00','10:00:00',NULL),(52,NULL,NULL,NULL,'09:00:00','10:00:00','6'),(53,'2024-04-10','Benjy','#000000','17:18:00','19:18:00','3'),(54,'2024-04-10','Benjy','#000000','17:18:00','19:18:00','3'),(55,'2024-01-07','Benjy','#6bdd0e','17:20:00','19:20:00','5'),(56,'2024-01-03','אדר','#1dd799','08:00:00','09:00:00','5'),(57,'2024-03-10','יהב','#18a090','10:00:00','11:00:00','5'),(70,'2024-06-19','אדר','#7c74e7','08:00:00','09:00:00','6'),(71,'2024-10-17','יהב','#0481f6','14:00:00','15:00:00',''),(72,'2024-10-17','יהב','#0481f6','14:00:00','15:00:00','2'),(73,'2024-10-17','יהב','#b738a0','16:00:00','17:00:00','7'),(75,'2024-01-07','אדר','#5a3767','11:10:00','12:00:00','7'),(76,'2024-01-07','אדר','#5a3767','11:10:00','12:00:00','7'),(77,'2024-01-07','יהב','#318c7d','17:00:00','18:00:00','4'),(78,'2024-01-07','אדר','#6d7e15','18:00:00','19:00:00','4'),(79,'2024-01-07','אדר','#c788c8','18:00:00','19:00:00','7'),(80,'2024-01-07','אדר','#4a1c4a','13:00:00','14:00:00','3'),(81,'2024-01-07','Benjy','#800057','20:00:00','21:00:00','5'),(82,'2024-01-07','Benjy','#56f038','20:00:00','21:00:00','5'),(86,'2024-01-07','Benjy','#4f5363','23:00:00','02:00:00','2'),(88,'2024-02-12','Benjy','#17debc','08:00:00','11:00:00','2'),(89,'2024-02-12','אדר','#396059','08:00:00','09:30:00','2'),(92,'2024-01-10','אדר','#5194c8','15:00:00','17:30:00','6'),(93,'2024-01-10','יהב','#088ff7','09:00:00','17:30:00','3'),(95,'2024-02-13','מיצי','#a49d9d','08:30:00','13:00:00','5'),(96,'2024-02-14','יפעת','#6693db','08:30:00','12:00:00','3'),(104,'2024-02-02','מיצי','#197d9f','12:00:00','15:00:00','מטבח'),(106,'2024-02-01','אדר','#ed0c90','10:00:00','13:00:00','5');
/*!40000 ALTER TABLE `selected_dates` ENABLE KEYS */;
UNLOCK TABLES;



-- Dump completed on 2024-02-08 14:29:20
