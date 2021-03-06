SET FOREIGN_KEY_CHECKS=0;


DROP TABLE IF EXISTS `players`;
DROP TABLE IF EXISTS `teams`;
DROP TABLE IF EXISTS `positions`;
DROP TABLE IF EXISTS `players_positions`;
DROP TABLE IF EXISTS `fantasy_teams`;
DROP TABLE IF EXISTS `fantasy_players`;
DROP TABLE IF EXISTS `coaches`;
DROP TABLE IF EXISTS `locations`;
DROP TABLE IF EXISTS `leagues`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `users_leagues`;


CREATE TABLE players (
    playerId BIGINT PRIMARY KEY,
    fname VARCHAR(255),
    lname VARCHAR(255),
    teamId BIGINT NULL,
    pos VARCHAR(255),
    years INT,
    FOREIGN KEY (teamId) REFERENCES teams(teamId)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE fantasy_teams (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	league INT,
	owner VARCHAR(255),
	FOREIGN KEY (league) REFERENCES leagues(id)
		ON DELETE SET NULL ON UPDATE CASCADE,
	FOREIGN KEY (owner) REFERENCES users(username)
		ON DELETE SET NULL ON UPDATE CASCADE
		
);

CREATE TABLE fantasy_players (
	id INT AUTO_INCREMENT PRIMARY KEY,
	playerId BIGINT,
	teamId INT,
	FOREIGN KEY (playerId) REFERENCES players(playerId)
		ON DELETE SET NULL ON UPDATE CASCADE,
	FOREIGN KEY (teamId) REFERENCES fantasy_teams(id)
		ON DELETE SET NULL ON UPDATE CASCADE
);
	

CREATE TABLE teams (
    teamId BIGINT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE leagues (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	publicKey INT NULL,
	admin VARCHAR(255), 
	FOREIGN KEY (admin) REFERENCES users(username)
		ON DELETE SET NULL ON UPDATE CASCADE 
);

CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) UNIQUE,
	passwordHash VARCHAR(255), 
	salt VARCHAR(255),
	email VARCHAR(255) NULL
);

CREATE TABLE users_leagues (
	id INT AUTO_INCREMENT PRIMARY KEY, 
	userId INT, 
	leagueId INT,
	FOREIGN KEY (leagueId) REFERENCES leagues(id)
		ON DELETE SET NULL ON UPDATE CASCADE,
	FOREIGN KEY (userID) REFERENCES users(id)
		ON DELETE SET NULL ON UPDATE CASCADE	
);

--INSERT INTO leagues(name) VALUES ('Our League');

INSERT INTO positions(name) VALUES('G'); 
INSERT INTO positions(name) VALUES('G-F');
INSERT INTO positions(name) VALUES('F'); 
INSERT INTO positions(name) VALUES('F-C');  
INSERT INTO positions(name) VALUES('C'); 


INSERT INTO teams(teamId,name) VALUES (1610612737,'Hawks');
INSERT INTO teams(teamId,name) VALUES (1610612738,'Celtics');
INSERT INTO teams(teamId,name) VALUES (1610612751,'Nets');
INSERT INTO teams(teamId,name) VALUES (1610612766,'Hornets');
INSERT INTO teams(teamId,name) VALUES (1610612741,'Bulls');
INSERT INTO teams(teamId,name) VALUES (1610612739,'Cavaliers');
INSERT INTO teams(teamId,name) VALUES (1610612742,'Mavericks');
INSERT INTO teams(teamId,name) VALUES (1610612743,'Nuggets');
INSERT INTO teams(teamId,name) VALUES (1610612765,'Pistons');
INSERT INTO teams(teamId,name) VALUES (1610612744,'Warriors');
INSERT INTO teams(teamId,name) VALUES (1610612745,'Rockets');
INSERT INTO teams(teamId,name) VALUES (1610612754,'Pacers');
INSERT INTO teams(teamId,name) VALUES (1610612747,'Lakers');
INSERT INTO teams(teamId,name) VALUES (1610612746,'Clippers');
INSERT INTO teams(teamId,name) VALUES (1610612763,'Grizzlies');
INSERT INTO teams(teamId,name) VALUES (1610612748,'Heat');
INSERT INTO teams(teamId,name) VALUES (1610612749,'Bucks');
INSERT INTO teams(teamId,name) VALUES (1610612750,'Timberwolves');
INSERT INTO teams(teamId,name) VALUES (1610612740,'Pelicans');
INSERT INTO teams(teamId,name) VALUES (1610612752,'Knicks');
INSERT INTO teams(teamId,name) VALUES (1610612760,'Thunder');
INSERT INTO teams(teamId,name) VALUES (1610612753,'Magic');
INSERT INTO teams(teamId,name) VALUES (1610612755,'76ers');
INSERT INTO teams(teamId,name) VALUES (1610612756,'Suns');
INSERT INTO teams(teamId,name) VALUES (1610612757,'Trail Blazers');
INSERT INTO teams(teamId,name) VALUES (1610612758,'Kings');
INSERT INTO teams(teamId,name) VALUES (1610612759,'Spurs');
INSERT INTO teams(teamId,name) VALUES (1610612761,'Raptors');
INSERT INTO teams(teamId,name) VALUES (1610612762,'Jazz');
INSERT INTO teams(teamId,name) VALUES (1610612764,'Wizards');

/*
INSERT INTO fantasy_teams(name,league) VALUES ('JC',1);
INSERT INTO fantasy_teams(name,league) VALUES ('EL',1);
INSERT INTO fantasy_teams(name,league) VALUES ('RF',1);
INSERT INTO fantasy_teams(name,league) VALUES ('SH',1);
INSERT INTO fantasy_teams(name,league) VALUES ('EC',1);
INSERT INTO fantasy_teams(name,league) VALUES ('NC',1);
INSERT INTO fantasy_teams(name,league) VALUES ('CR',1);
INSERT INTO fantasy_teams(name,league) VALUES ('BH',1);
INSERT INTO fantasy_teams(name,league) VALUES ('TC',1);
INSERT INTO fantasy_teams(name,league) VALUES ('MJ',1);


INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627732',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628378',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626178',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203084',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626167',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203468',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627742',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203506',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203914',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627739',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201935',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627741',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628381',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('200765',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628462',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203994',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201568',1);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203085',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627747',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627752',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202329',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202326',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201942',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201163',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626168',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203077',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203458',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2544',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203083',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628372',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201569',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203932',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('200794',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202738',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203501',2);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('200768',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201936',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2738',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203944',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202696',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203078',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203076',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201952',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203933',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626171',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203081',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203095',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202324',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202683',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('101141',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203464',3);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203901',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203115',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203114',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626157',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('200826',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203089',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202710',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628398',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202703',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('204001',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203991',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203079',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203935',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626143',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('101127',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201609',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203897',4);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628366',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('200755',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203507',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1717',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202685',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202689',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627759',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203471',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2730',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203200',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203110',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626164',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201583',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2747',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627763',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628455',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628365',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203953',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203552',5);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201566',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627812',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626162',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2546',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('101162',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203952',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628369',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('200746',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201152',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201959',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203954',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2548',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201584',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203087',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626204',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202355',6);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202339',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201950',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201142',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201949',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203500',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('101150',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203613',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626161',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203145',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202083',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('101108',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201567',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203967',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202704',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202344',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203459',7);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202322',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203484',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202331',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203999',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201599',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203915',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201960',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203918',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201577',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201937',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202699',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202693',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2772',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202328',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201563',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201933',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202340',8);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202681',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('204020',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202711',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('2200',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201572',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201954',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627734',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202695',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202691',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201143',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201586',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203109',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201588',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202694',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203482',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('202734',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626156',9);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627749',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627750',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203496',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('200752',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626163',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627755',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201587',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1627737',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('204060',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1628374',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203497',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('203490',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626196',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201188',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626179',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('1626159',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201939',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201144',10);
INSERT INTO fantasy_players(playerId,teamId) VALUES ('201976',10);

*/





INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203518,'Alex','Abrines',1610612760,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203112,'Quincy','Acy',1610612751,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203500,'Steven','Adams',1610612760,'C',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628389,'Bam','Adebayo',1610612748,'C-F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201167,'Arron','Afflalo',1610612753,'G',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201582,'Alexis','Ajinca',1610612740,'C',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202332,'Cole','Aldrich',1610612750,'C',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200746,'LaMarcus','Aldridge',1610612759,'F',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628386,'Jarrett','Allen',1610612751,'C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628443,'Kadeem','Allen',1610612738,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2754,'Tony','Allen',1610612740,'G-F',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202329,'Al-Farouq','Aminu',1610612757,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626147,'Justin','Anderson',1610612755,'G-F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203937,'Kyle','Anderson',1610612759,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201583,'Ryan','Anderson',1610612745,'F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628387,'Ike','Anigbogu',1610612754,'C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203507,'Giannis','Antetokounmpo',1610612749,'F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2546,'Carmelo','Anthony',1610612760,'F',14);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628384,'OG','Anunoby',1610612761,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627853,'Ryan','Arcidiacono',1610612741,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2772,'Trevor','Ariza',1610612745,'F-G',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201589,'Darrell','Arthur',1610612743,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628503,'Jamel','Artis',1610612753,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201600,'Omer','Asik',1610612740,'C',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201571,'D.J.','Augustin',1610612753,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202337,'Luke','Babbitt',1610612737,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628407,'Dwayne','Bacon',1610612766,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627758,'Ron','Baker',1610612752,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627735,'Wade','Baldwin IV',1610612757,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628366,'Lonzo','Ball',1610612747,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200826,'J.J.','Barea',1610612742,'G',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203084,'Harrison','Barnes',1610612742,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203115,'Will','Barton',1610612743,'G-F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201587,'Nicolas','Batum',1610612766,'G-F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201573,'Jerryd','Bayless',1610612755,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203382,'Aron','Baynes',1610612738,'C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203145,'Kent','Bazemore',1610612737,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203078,'Bradley','Beal',1610612764,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627736,'Malik','Beasley',1610612743,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201563,'Michael','Beasley',1610612752,'F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201158,'Marco','Belinelli',1610612737,'G-F',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628395,'Jordan','Bell',1610612744,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627761,'DeAndre''','Bembry',1610612737,'F-G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627733,'Dragan','Bender',1610612756,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202722,'Davis','Bertans',1610612759,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201976,'Patrick','Beverley',1610612746,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203920,'Khem','Birch',1610612753,'C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628444,'Jabari','Bird',1610612738,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202687,'Bismack','Biyombo',1610612753,'C',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202357,'Nemanja','Bjelica',1610612750,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204028,'Tarik','Black',1610612745,'F-C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628469,'Antonio','Blakeney',1610612741,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202339,'Eric','Bledsoe',1610612749,'G',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203505,'Vander','Blue',1610612747,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203992,'Bogdan','Bogdanovic',1610612758,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202711,'Bojan','Bogdanovic',1610612754,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101106,'Andrew','Bogut',1610612747,'C',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627762,'Joel','Bolomboy',1610612749,'F-C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626164,'Devin','Booker',1610612756,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202344,'Trevor','Booker',1610612755,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628449,'Chris','Boucher',1610612744,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202340,'Avery','Bradley',1610612765,'G',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628396,'Tony','Bradley',1610612762,'C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201147,'Corey','Brewer',1610612747,'F',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627763,'Malcolm','Brogdon',1610612749,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201166,'Aaron','Brooks',1610612750,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628415,'Dillon','Brooks',1610612763,'F-G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626148,'Anthony','Brown',1610612750,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201628,'Bobby','Brown',1610612745,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627759,'Jaylen','Brown',1610612738,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203485,'Lorenzo','Brown',1610612761,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628425,'Sterling','Brown',1610612749,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627852,'Nicolas','Brussino',1610612737,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628418,'Thomas','Bryant',1610612747,'C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203493,'Reggie','Bullock',1610612765,'F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202692,'Alec','Burks',1610612762,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202710,'Jimmy','Butler',1610612750,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202779,'Dwight','Buycks',1610612765,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203998,'Bruno','Caboclo',1610612761,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101181,'Jose','Calderon',1610612739,'G',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203484,'Kentavious','Caldwell-Pope',1610612747,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203991,'Clint','Capela',1610612745,'C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201960,'DeMarre','Carroll',1610612751,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1713,'Vince','Carter',1610612758,'G-F',19);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203487,'Michael','Carter-Williams',1610612766,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627936,'Alex','Caruso',1610612747,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201956,'Omri','Casspi',1610612744,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626161,'Willie','Cauley-Stein',1610612758,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628463,'Tyler','Cavanaugh',1610612737,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201596,'Mario','Chalmers',1610612763,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2199,'Tyson','Chandler',1610612756,'C',16);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201163,'Wilson','Chandler',1610612743,'F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627737,'Marquese','Chriss',1610612756,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203546,'Ian','Clark',1610612740,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203903,'Jordan','Clarkson',1610612747,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628499,'Antonius','Cleveland',1610612742,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628381,'John','Collins',1610612737,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628380,'Zach','Collins',1610612757,'C-F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201954,'Darren','Collison',1610612754,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2555,'Nick','Collison',1610612760,'F',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201144,'Mike','Conley',1610612763,'G',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626192,'Pat','Connaughton',1610612757,'G-F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626188,'Quinn','Cook',1610612744,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628429,'Charles','Cooke',1610612740,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204022,'Jack','Cooley',1610612758,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627856,'Matt','Costello',1610612759,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202326,'DeMarcus','Cousins',1610612740,'C',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203496,'Robert','Covington',1610612755,'F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203459,'Allen','Crabbe',1610612751,'G-F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628470,'Torrey','Craig',1610612743,'G-F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2037,'Jamal','Crawford',1610612750,'G',17);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203109,'Jae','Crowder',1610612739,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201967,'Dante','Cunningham',1610612740,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203552,'Seth','Curry',1610612742,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201939,'Stephen','Curry',1610612744,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203584,'Troy','Daniels',1610612756,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203076,'Anthony','Davis',1610612740,'F-C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627738,'Deyonta','Davis',1610612763,'C-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202334,'Ed','Davis',1610612757,'F-C',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203473,'Dewayne','Dedmon',1610612737,'C',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626155,'Sam','Dekker',1610612746,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627098,'Malcolm','Delaney',1610612737,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203521,'Matthew','Dellavedova',1610612749,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2736,'Luol','Deng',1610612747,'F',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201942,'DeMar','DeRozan',1610612761,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627767,'Cheick','Diallo',1610612740,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203476,'Gorgui','Dieng',1610612750,'C',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203915,'Spencer','Dinwiddie',1610612751,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628416,'Tyler','Dorsey',1610612737,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628422,'Damyean','Dotson',1610612752,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628408,'PJ','Dozier',1610612760,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201609,'Goran','Dragic',1610612748,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203083,'Andre','Drummond',1610612765,'C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201162,'Jared','Dudley',1610612756,'F',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627739,'Kris','Dunn',1610612741,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201142,'Kevin','Durant',1610612744,'F',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627740,'Henry','Ellenson',1610612765,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201961,'Wayne','Ellington',1610612748,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203954,'Joel','Embiid',1610612755,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203898,'Tyler','Ennis',1610612747,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203516,'James','Ennis III',1610612763,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628393,'Jawun','Evans',1610612746,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201936,'Tyreke','Evans',1610612763,'G-F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203957,'Dante','Exum',1610612762,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202702,'Kenneth','Faried',1610612743,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202324,'Derrick','Favors',1610612762,'F-C',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627770,'Kay','Felder',1610612741,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626245,'Cristiano','Felicio',1610612741,'C-F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101109,'Raymond','Felton',1610612760,'G',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628390,'Terrance','Ferguson',1610612760,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627812,'Yogi','Ferrell',1610612742,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627827,'Dorian','Finney-Smith',1610612742,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627854,'Bryn','Forbes',1610612759,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203095,'Evan','Fournier',1610612753,'F-G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628368,'De''Aaron','Fox',1610612758,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204025,'Tim','Frazier',1610612764,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101112,'Channing','Frye',1610612739,'F',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628365,'Markelle','Fultz',1610612755,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201568,'Danilo','Gallinari',1610612746,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204038,'Langston','Galloway',1610612765,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201188,'Marc','Gasol',1610612763,'C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2200,'Pau','Gasol',1610612759,'C',16);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200752,'Rudy','Gay',1610612759,'F',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202331,'Paul','George',1610612760,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627875,'Marcus','Georges-Hunt',1610612750,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201959,'Taj','Gibson',1610612750,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628385,'Harry','Giles',1610612758,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1938,'Manu','Ginobili',1610612759,'G',15);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203497,'Rudy','Gobert',1610612762,'C',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203932,'Aaron','Gordon',1610612753,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201569,'Eric','Gordon',1610612745,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101162,'Marcin','Gortat',1610612764,'C',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626203,'Treveon','Graham',1610612766,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203924,'Jerami','Grant',1610612760,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626170,'Jerian','Grant',1610612741,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201980,'Danny','Green',1610612759,'G-F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203110,'Draymond','Green',1610612744,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203210,'JaMychal','Green',1610612763,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201145,'Jeff','Green',1610612739,'F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201933,'Blake','Griffin',1610612746,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203547,'Eric','Griffin',1610612762,'C-F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627772,'Daniel','Hamilton',1610612760,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627773,'AJ','Hammons',1610612748,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203501,'Tim','Hardaway Jr.',1610612752,'F-G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201935,'James','Harden',1610612745,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203090,'Maurice','Harkless',1610612757,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626149,'Montrezl','Harrell',1610612746,'F-C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2734,'Devin','Harris',1610612742,'G',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203914,'Gary','Harris',1610612743,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203925,'Joe','Harris',1610612751,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202699,'Tobias','Harris',1610612765,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626150,'Andrew','Harrison',1610612763,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628404,'Josh','Hart',1610612747,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2617,'Udonis','Haslem',1610612748,'F',14);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202330,'Gordon','Hayward',1610612738,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203089,'John','Henson',1610612749,'F-C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627823,'Juan','Hernangomez',1610612743,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626195,'Willy','Hernangomez',1610612752,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626209,'Mario','Hezonja',1610612753,'G-F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628439,'Isaiah','Hicks',1610612752,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627741,'Buddy','Hield',1610612758,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201588,'George','Hill',1610612758,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203524,'Solomon','Hill',1610612740,'F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626199,'Darrun','Hilliard',1610612759,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201950,'Jrue','Holiday',1610612740,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203200,'Justin','Holiday',1610612741,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204066,'John','Holland',1610612739,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626178,'Rondae','Hollis-Jefferson',1610612751,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626158,'Richaun','Holmes',1610612755,'F-C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203918,'Rodney','Hood',1610612762,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201143,'Al','Horford',1610612738,'F-C',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2730,'Dwight','Howard',1610612766,'C',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203962,'Josh','Huestis',1610612760,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626205,'Vincent','Hunter',1610612763,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201586,'Serge','Ibaka',1610612761,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2738,'Andre','Iguodala',1610612744,'G-F',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101141,'Ersan','Ilyasova',1610612737,'F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204060,'Joe','Ingles',1610612762,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627742,'Brandon','Ingram',1610612747,'F-G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202681,'Kyrie','Irving',1610612738,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628371,'Jonathan','Isaac',1610612753,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628411,'Wes','Iwundu',1610612753,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101127,'Jarrett','Jack',1610612752,'G',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627743,'Demetrius','Jackson',1610612745,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628402,'Frank','Jackson',1610612740,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628367,'Josh','Jackson',1610612756,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628382,'Justin','Jackson',1610612758,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202704,'Reggie','Jackson',1610612765,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2544,'LeBron','James',1610612739,'F-G',14);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628455,'Mike','James',1610612756,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2744,'Al','Jefferson',1610612754,'C',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2210,'Richard','Jefferson',1610612743,'F',16);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201973,'Jonas','Jerebko',1610612762,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101161,'Amir','Johnson',1610612755,'F-C',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627744,'Brice','Johnson',1610612746,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626177,'Dakari','Johnson',1610612760,'C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201949,'James','Johnson',1610612748,'F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2207,'Joe','Johnson',1610612762,'G-F',16);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626169,'Stanley','Johnson',1610612765,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204020,'Tyler','Johnson',1610612748,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202325,'Wesley','Johnson',1610612746,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203999,'Nikola','Jokic',1610612743,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627745,'Damian','Jones',1610612744,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627883,'Jalen','Jones',1610612740,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626145,'Tyus','Jones',1610612750,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201599,'DeAndre','Jordan',1610612746,'C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202709,'Cory','Joseph',1610612754,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626163,'Frank','Kaminsky',1610612766,'F-C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202683,'Enes','Kanter',1610612752,'C',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628379,'Luke','Kennard',1610612765,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203077,'Michael','Kidd-Gilchrist',1610612766,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628467,'Maxi','Kleber',1610612742,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202688,'Brandon','Knight',1610612756,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627788,'Furkan','Korkmaz',1610612755,'G-F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628436,'Luke','Kornet',1610612752,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2594,'Kyle','Korver',1610612739,'G',14);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201585,'Kosta','Koufos',1610612758,'C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628398,'Kyle','Kuzma',1610612747,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627746,'Skal','Labissiere',1610612758,'F-C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203087,'Jeremy','Lamb',1610612766,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203499,'Shane','Larkin',1610612738,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203530,'Joffrey','Lauvergne',1610612759,'C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203897,'Zach','LaVine',1610612741,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627774,'Jake','Layman',1610612757,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628388,'TJ','Leaf',1610612754,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201584,'Courtney','Lee',1610612752,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203458,'Alex','Len',1610612756,'C',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202695,'Kawhi','Leonard',1610612759,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203086,'Meyers','Leonard',1610612757,'C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202720,'Jon','Leuer',1610612765,'F-C',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627747,'Caris','LeVert',1610612751,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202732,'DeAndre','Liggins',1610612749,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203081,'Damian','Lillard',1610612757,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202391,'Jeremy','Lin',1610612751,'G',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2733,'Shaun','Livingston',1610612744,'G',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626172,'Kevon','Looney',1610612744,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201572,'Brook','Lopez',1610612747,'C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201577,'Robin','Lopez',1610612741,'C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201567,'Kevin','Love',1610612739,'F-C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200768,'Kyle','Lowry',1610612761,'G',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627789,'Timothe','Luwawu-Cabarrot',1610612755,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628399,'Tyler','Lydon',1610612743,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626168,'Trey','Lyles',1610612743,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627815,'Sheldon','Mac',1610612764,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202714,'Shelvin','Mack',1610612753,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203705,'Josh','Magette',1610612737,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101133,'Ian','Mahinmi',1610612764,'C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627748,'Thon','Maker',1610612749,'C-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626246,'Boban','Marjanovic',1610612765,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628374,'Lauri','Markkanen',1610612741,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626185,'Jarell','Martin',1610612763,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628412,'Frank','Mason',1610612758,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628493,'Mangok','Mathiang',1610612766,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202083,'Wesley','Matthews',1610612742,'G-F',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201601,'Luc','Mbah a Moute',1610612745,'F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203949,'James Michael','McAdoo',1610612755,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627775,'Patrick','McCaw',1610612744,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203468,'CJ','McCollum',1610612757,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204456,'T.J.','McConnell',1610612755,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626191,'Chris','McCullough',1610612764,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203926,'Doug','McDermott',1610612752,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201580,'JaVale','McGee',1610612744,'C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203585,'Rodney','McGruder',1610612748,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628035,'Alfonzo','McKinnie',1610612761,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203463,'Ben','McLemore',1610612763,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201177,'Josh','McRoberts',1610612742,'F-C',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201975,'Jodie','Meeks',1610612764,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626257,'Salah','Mejri',1610612742,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626175,'Jordan','Mickey',1610612748,'C-F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203114,'Khris','Middleton',1610612749,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101139,'CJ','Miles',1610612761,'F-G',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203121,'Darius','Miller',1610612740,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626259,'Malcolm','Miller',1610612761,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201988,'Patty','Mills',1610612759,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200794,'Paul','Millsap',1610612743,'F',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202703,'Nikola','Mirotic',1610612741,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628378,'Donovan','Mitchell',1610612762,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628370,'Malik','Monk',1610612766,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202328,'Greg','Monroe',1610612756,'C-F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626242,'Luis','Montero',1610612765,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202734,'E''Twaun','Moore',1610612740,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203961,'Eric','Moreland',1610612765,'F-C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202694,'Marcus','Morris',1610612738,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202693,'Markieff','Morris',1610612764,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628420,'Monte','Morris',1610612743,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628405,'Johnathan','Motley',1610612742,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202389,'Timofey','Mozgov',1610612751,'C',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626144,'Emmanuel','Mudiay',1610612743,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203498,'Shabazz','Muhammad',1610612750,'G-F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627749,'Dejounte','Murray',1610612759,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627750,'Jamal','Murray',1610612743,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203488,'Mike','Muscala',1610612737,'F-C',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627846,'Abdel','Nader',1610612738,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626204,'Larry','Nance Jr.',1610612747,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203894,'Shabazz','Napier',1610612757,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2749,'Jameer','Nelson',1610612740,'G',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203526,'Raul','Neto',1610612762,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201149,'Joakim','Noah',1610612752,'C',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203457,'Nerlens','Noel',1610612742,'C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203512,'Lucas','Nogueira',1610612761,'C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1717,'Dirk','Nowitzki',1610612742,'F-C',19);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628373,'Frank','Ntilikina',1610612752,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203994,'Jusuf','Nurkic',1610612757,'C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628021,'David','Nwaba',1610612741,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203948,'Johnny','O''Bryant III',1610612766,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626220,'Royce','O''Neale',1610612762,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203124,'Kyle','O''Quinn',1610612752,'C-F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628400,'Semi','Ojeleye',1610612738,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626143,'Jahlil','Okafor',1610612751,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203506,'Victor','Oladipo',1610612754,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203482,'Kelly','Olynyk',1610612748,'C-F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627778,'Chinanu','Onuaku',1610612745,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626224,'Cedi','Osman',1610612739,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628473,'Yakuba','Ouattara',1610612751,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626162,'Kelly','Oubre Jr.',1610612764,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2585,'Zaza','Pachulia',1610612744,'C',14);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627779,'Marcus','Paige',1610612766,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627834,'Georgios','Papagiannis',1610612758,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203953,'Jabari','Parker',1610612749,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2225,'Tony','Parker',1610612759,'G',16);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202718,'Chandler','Parsons',1610612763,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202335,'Patrick','Patterson',1610612760,'F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628383,'Justin','Patton',1610612750,'C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203464,'Brandon','Paul',1610612759,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101108,'Chris','Paul',1610612745,'G',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203940,'Adreian','Payne',1610612753,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626166,'Cameron','Payne',1610612741,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203901,'Elfrid','Payton',1610612753,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627780,'Gary','Payton II',1610612749,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628506,'London','Perrantes',1610612739,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628409,'Alec','Peters',1610612756,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203486,'Mason','Plumlee',1610612743,'C-F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203101,'Miles','Plumlee',1610612737,'C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627751,'Jakob','Poeltl',1610612761,'C',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202347,'Quincy','Pondexter',1610612741,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203490,'Otto','Porter Jr.',1610612764,'F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626171,'Bobby','Portis',1610612741,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (204001,'Kristaps','Porzingis',1610612752,'F-C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203939,'Dwight','Powell',1610612742,'F-C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626181,'Norman','Powell',1610612761,'F-G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627816,'Alex','Poythress',1610612754,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627752,'Taurean','Prince',1610612737,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626643,'Jacob','Pullen',1610612755,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627753,'Zhou','Qi',1610612745,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628397,'Ivan','Rabb',1610612763,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203944,'Julius','Randle',1610612747,'F-C',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2216,'Zach','Randolph',1610612758,'F',16);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200755,'JJ','Redick',1610612755,'F-G',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628432,'Davon','Reed',1610612756,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203186,'Willie','Reed',1610612746,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626196,'Josh','Richardson',1610612748,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627781,'Malachi','Richardson',1610612758,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203085,'Austin','Rivers',1610612746,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203460,'Andre','Roberson',1610612760,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628421,'Devin','Robinson',1610612764,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203922,'Glenn','Robinson III',1610612754,'G-F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200765,'Rajon','Rondo',1610612740,'G',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201565,'Derrick','Rose',1610612739,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203082,'Terrence','Ross',1610612753,'G-F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626179,'Terry','Rozier',1610612738,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201937,'Ricky','Rubio',1610612762,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626156,'D''Angelo','Russell',1610612751,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627734,'Domantas','Sabonis',1610612754,'C-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203960,'JaKarr','Sampson',1610612758,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203967,'Dario','Saric',1610612755,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203107,'Tomas','Satoransky',1610612764,'F-G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203471,'Dennis','Schroder',1610612737,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203118,'Mike','Scott',1610612764,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200757,'Thabo','Sefolosha',1610612762,'F',11);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627782,'Wayne','Selden',1610612763,'G-F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201196,'Ramon','Sessions',1610612752,'G',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202697,'Iman','Shumpert',1610612739,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627783,'Pascal','Siakam',1610612761,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627732,'Ben','Simmons',1610612755,'G-F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203613,'Jonathon','Simmons',1610612753,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628424,'Kobi','Simmons',1610612763,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202713,'Kyle','Singler',1610612760,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203935,'Marcus','Smart',1610612738,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202397,'Ish','Smith',1610612765,'G',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201160,'Jason','Smith',1610612764,'F-C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2747,'JR','Smith',1610612739,'G-F',13);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628372,'Dennis','Smith Jr.',1610612742,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203503,'Tony','Snell',1610612749,'G',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201578,'Marreese','Speights',1610612753,'F-C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203917,'Nik','Stauskas',1610612751,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202362,'Lance','Stephenson',1610612754,'G',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202933,'Julyan','Stone',1610612766,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628410,'Edmond','Sumner',1610612754,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628403,'Caleb','Swanigan',1610612757,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628369,'Jayson','Tatum',1610612738,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627819,'Isaiah','Taylor',1610612737,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201952,'Jeff','Teague',1610612750,'G',8);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203141,'Mirza','Teletovic',1610612749,'F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202066,'Garrett','Temple',1610612758,'G',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628462,'Milos','Teodosic',1610612746,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1891,'Jason','Terry',1610612749,'G',18);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628464,'Daniel','Theis',1610612738,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202738,'Isaiah','Thomas',1610612739,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202498,'Lance','Thomas',1610612752,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202691,'Klay','Thompson',1610612744,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202684,'Tristan','Thompson',1610612739,'C-F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628414,'Sindarius','Thornwell',1610612746,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201229,'Anthony','Tolliver',1610612765,'F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626157,'Karl-Anthony','Towns',1610612750,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (200782,'PJ','Tucker',1610612745,'F',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202323,'Evan','Turner',1610612757,'G-F',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626167,'Myles','Turner',1610612754,'C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202327,'Ekpe','Udoh',1610612762,'C-F',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627755,'Tyler','Ulis',1610612756,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202685,'Jonas','Valanciunas',1610612761,'C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627756,'Denzel','Valentine',1610612741,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627832,'Fred','VanVleet',1610612761,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626173,'Rashad','Vaughn',1610612749,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203943,'Noah','Vonleh',1610612757,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202696,'Nikola','Vucevic',1610612753,'C',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2548,'Dwyane','Wade',1610612739,'G',14);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203079,'Dion','Waiters',1610612748,'G',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202689,'Kemba','Walker',1610612766,'G',6);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202322,'John','Wall',1610612764,'G',7);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628476,'Derrick','Walton Jr.',1610612748,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203933,'TJ','Warren',1610612756,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627362,'Briante','Weber',1610612745,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2561,'David','West',1610612744,'F',14);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201566,'Russell','Westbrook',1610612760,'G',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628401,'Derrick','White',1610612759,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627855,'Okaro','White',1610612748,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627785,'Isaiah','Whitehead',1610612751,'G',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (202355,'Hassan','Whiteside',1610612748,'C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203952,'Andrew','Wiggins',1610612750,'F',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203912,'CJ','Wilcox',1610612757,'G',3);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628451,'Jacob','Wiley',1610612751,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (2863,'Damien','Wilkins',1610612754,'G-F',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626210,'Alan','Williams',1610612756,'F-C',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203710,'C.J.','Williams',1610612746,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101150,'Lou','Williams',1610612746,'G',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (101107,'Marvin','Williams',1610612766,'F',12);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627786,'Troy','Williams',1610612745,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628475,'Matt','Williams Jr.',1610612748,'G',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628391,'D.J.','Wilson',1610612749,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203966,'Jamil','Wilson',1610612746,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626159,'Justise','Winslow',1610612748,'F',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203481,'Jeff','Withey',1610612742,'C',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203489,'Nate','Wolters',1610612762,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201148,'Brandan','Wright',1610612763,'F-C',9);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626153,'Delon','Wright',1610612761,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627824,'Guerschon','Yabusele',1610612738,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1626202,'Joe','Young',1610612754,'G',2);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1628454,'Mike','Young',1610612764,'F',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201156,'Nick','Young',1610612744,'G-F',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (201152,'Thaddeus','Young',1610612754,'F',10);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203469,'Cody','Zeller',1610612766,'C-F',4);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (203092,'Tyler','Zeller',1610612751,'C',5);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627835,'Paul','Zipser',1610612741,'F',1);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627790,'Ante','Zizic',1610612739,'F-C',0);
INSERT INTO players(playerId,fname,lname,teamId,pos,years) VALUES (1627826,'Ivica','Zubac',1610612747,'C',1);


