drop database db_control_inventario;
create database db_control_inventario;

create user IF NOT EXISTS  ucr_user@'localhost';
ALTER USER 'ucr_user'@'localhost' IDENTIFIED BY 'ucr_recinto_guapiles_2021';
grant all on db_control_inventario.* to 'ucr_user'@'localhost' ;
ALTER USER 'ucr_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ucr_recinto_guapiles_2021';
FLUSH PRIVILEGES;

use db_control_inventario;
-- MySQL Workbench Forward Engineering
-- MySQL Workbench Forward Engineering
-- MySQL Workbench Forward Engineering



-- -----------------------------------------------------
-- Table `db_control_inventario`.`active`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_control_inventario`.`active` (
  `idActive` SMALLINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `licensePlate` VARCHAR(100) NULL DEFAULT NULL,
  `description` VARCHAR(300) NOT NULL,
  `mark` VARCHAR(50) NULL DEFAULT NULL,
  `model` VARCHAR(50) NULL DEFAULT NULL,
  `serie` VARCHAR(50) NULL DEFAULT NULL,
  `placeOrigin` VARCHAR(150) NOT NULL,
  `amount` SMALLINT NOT NULL,
  `isLoan` TINYINT(1) NOT NULL,
  PRIMARY KEY (`idActive`));


-- -----------------------------------------------------
-- Table `db_control_inventario`.`edifice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_control_inventario`.`edifice` (
  `idEdifice` SMALLINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(125) NOT NULL,
  `isEnabled` TINYINT(1) NOT NULL,
  PRIMARY KEY (`idEdifice`));


-- -----------------------------------------------------
-- Table `db_control_inventario`.`area`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_control_inventario`.`area` (
  `idArea` SMALLINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(125) NOT NULL,
  `isEnabled` TINYINT(1) NOT NULL,
  `idEdifice` SMALLINT NOT NULL,
  PRIMARY KEY (`idArea`),
  INDEX `idEdifice` (`idEdifice` ASC) VISIBLE,
  CONSTRAINT `area_ibfk_1`
    FOREIGN KEY (`idEdifice`)
    REFERENCES `db_control_inventario`.`edifice` (`idEdifice`));


-- -----------------------------------------------------
-- Table `db_control_inventario`.`area-active`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_control_inventario`.`area-active` (
  `idActive` SMALLINT NOT NULL,
  `idArea` SMALLINT NOT NULL,
  `amount` SMALLINT NOT NULL,
  INDEX `idArea` (`idArea` ASC) VISIBLE,
  INDEX `idActive` (`idActive` ASC) VISIBLE,
  CONSTRAINT `area-active_ibfk_1`
    FOREIGN KEY (`idArea`)
    REFERENCES `db_control_inventario`.`area` (`idArea`),
  CONSTRAINT `area-active_ibfk_2`
    FOREIGN KEY (`idActive`)
    REFERENCES `db_control_inventario`.`active` (`idActive`));


-- -----------------------------------------------------
-- Table `db_control_inventario`.`loan`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_control_inventario`.`loan` (
  `idLoan` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `loanDate` DATETIME NOT NULL,
  PRIMARY KEY (`idLoan`));


-- -----------------------------------------------------
-- Table `db_control_inventario`.`loan-active`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_control_inventario`.`loan-active` (
  `idLoan` INT NOT NULL,
  `idActive` SMALLINT NOT NULL,
  PRIMARY KEY (`idLoan`, `idActive`),
  INDEX `idActive` (`idActive` ASC) VISIBLE,
  CONSTRAINT `loan-active_ibfk_1`
    FOREIGN KEY (`idLoan`)
    REFERENCES `db_control_inventario`.`loan` (`idLoan`),
  CONSTRAINT `loan-active_ibfk_2`
    FOREIGN KEY (`idActive`)
    REFERENCES `db_control_inventario`.`active` (`idActive`));


-- -----------------------------------------------------
-- Table `db_control_inventario`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_control_inventario`.`user` (
  `idUser` TINYINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idUser`));

USE `db_control_inventario` ;

-- -----------------------------------------------------
-- procedure sp_active_by_id
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_active_by_id`(
	in id smallint
)
BEGIN
	select * from `active` where idActive = id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_add_active
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_active`(
`new_name` varchar(150),
    license varchar(100),
    mark varchar(50),
    model varchar(50),
    serie varchar(50),
    amount smallint,
   placeOrigin varchar(150),
    `description` varchar(300)
)
BEGIN
insert into `active` 
values(null,`new_name`,license,`description`,mark,model,serie,placeOrigin,amount,false);
 select  idActive  from `active` order by idActive desc limit 1 ;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_add_area
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_area`(
	in `name` varchar(125),
    in idEdifice smallint
)
BEGIN
	insert into area values(null,`name`,true,idEdifice);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_add_edifice
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_edifice`(
	in `new_edifice_name` varchar(125)
)
BEGIN
	insert into edifice value(null,`new_edifice_name`,true);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_allActives
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_allActives`()
BEGIN
Select ac.* from `active` ac;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_allActives_by_area
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_allActives_by_area`(
	in idActive smallint
)
BEGIN
Select a.`name`,ed.`name` as edifice,aa.amount from `active` ac 
inner join `area-active` aa on
ac.idActive = aa.idActive
inner join area a on
aa.idArea = a.idArea
inner join edifice ed on
a.idEdifice = ed.idEdifice and aa.idActive=idActive;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_allActives_by_id_area
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_allActives_by_id_area`(
in id smallint
)
BEGIN
Select ac.*from `active` ac 
inner join `area-active` aa on
ac.idActive = aa.idActive
inner join area a on
aa.idArea = a.idArea
inner join edifice ed on
a.idEdifice = ed.idEdifice and aa.idArea=id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_allActives_by_id_edifice
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_allActives_by_id_edifice`(
in id smallint
)
BEGIN
Select ac.idActive,ac.`name`,aa.amount as amount, ac.licensePlate,ac.placeOrigin,ac.isLoan from `active` ac 
inner join `area-active` aa on
ac.idActive = aa.idActive
inner join area a on
aa.idArea = a.idArea
inner join edifice ed on
a.idEdifice = ed.idEdifice and ed.idEdifice=id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_all_area_edificio
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_area_edificio`(
	in id smallint
)
BEGIN
select a.idArea, a.`name`, 
 CASE WHEN a.isEnabled = 0 THEN 'false' ELSE 'true' END AS isEnabled
 ,e.`name` as edifice from area a
    inner join edifice e on a.idEdifice = e.idEdifice and e.idEdifice = id
    and a.isEnabled=1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_all_areas
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_areas`()
BEGIN
	select a.idArea, a.`name`, 
     CASE WHEN a.isEnabled = 0 THEN 'false' ELSE 'true' END AS isEnabled
     ,e.`name` as edifice,e.idEdifice from area a
    inner join edifice e on a.idEdifice = e.idEdifice;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_all_areas_actives
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_areas_actives`()
BEGIN
	select a.idArea, a.`name`, 
     CASE WHEN a.isEnabled = 0 THEN 'false' ELSE 'true' END AS isEnabled
     ,e.`name` as edifice,e.idEdifice from area a
    inner join edifice e on a.idEdifice = e.idEdifice
    and a.isEnabled = 1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_all_edifices
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_edifices`()
BEGIN
	select idEdifice,`name`,
    CASE WHEN isEnabled = 0 THEN 'false' ELSE 'true' END AS isEnabled
    from edifice;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_all_edifices_actives
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_edifices_actives`()
BEGIN
select idEdifice,`name`,
    CASE WHEN isEnabled = 0 THEN 'false' ELSE 'true' END AS isEnabled
    from edifice where isEnabled = 1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_delete_distribution
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_distribution`(
	in id smallint
)
BEGIN
delete from `area-active` where idActive=id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_edit_active
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_edit_active`(
	in id smallint,
    `new_name` varchar(150),
    license varchar(100),
    mark varchar(50),
    model varchar(50),
    serie varchar(50),
    amount smallint,
    placeOrigin varchar(150),
    `description` varchar(300)
)
BEGIN
	update `active` set `name`=`new_name`,licensePlate=license,
    mark=mark,model=model, serie=serie, amount=amount,`description`=`description`,
    placeOrigin=placeOrigin where
    idActive= id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_edit_area
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_edit_area`(
	in id smallint, 
	in `new_name` varchar(125),
    in new_idEdifice smallint
)
BEGIN
	update area set `name`= `new_name`, idEdifice = new_idEdifice
    where idArea = id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_edit_area_status
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_edit_area_status`(
	in id smallint, 
	in `status` boolean
)
BEGIN
update area set isEnabled= `status`
    where idArea = id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_edit_distribution
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_edit_distribution`(
	in idActive smallint,
    in idArea smallint,
    in amount smallint
)
BEGIN
	insert into `area-active` values(idActive,idArea,amount);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_edit_edifice
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_edit_edifice`(
in id smallint,
in `new_edifice_name` varchar(125)
)
BEGIN
	update edifice set `name` = `new_edifice_name` where idEdifice = id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_edit_loan_active
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_edit_loan_active`(
	in id smallint,
    in `status` boolean
)
BEGIN
 update `active` set isLoan =`status` where idActive =id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_edit_status
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_edit_status`(
in id smallint,
in `status` varchar(125)
)
BEGIN
	update edifice set isEnabled = `status` where idEdifice = id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_insert_loan
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_loan`(
	in `name` varchar(150),
    in loanDate datetime
)
BEGIN
	insert into loan values(null,`name`,loanDate);
    select  idLoan  from loan order by idLoan desc limit 1 ;
 
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_insert_loan_active
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_loan_active`(
	in `idLoan` smallint,
    in idActive smallint
)
BEGIN
	insert into `loan-active` values(`idLoan`,idActive);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_loan_active
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_loan_active`(
	in id smallint,
    in `status` boolean
)
BEGIN
	update `active` set isLoan=`status` where idActive=id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_session
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_session`(
	in `user` varchar(50),
    in `psw` varchar(20)
)
BEGIN
	Select idUser from `user` where username = `user` and
    `password` = `psw`;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure sp_view_loan
-- -----------------------------------------------------

DELIMITER $$
USE `db_control_inventario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_view_loan`(
	in idActive smallint
)
BEGIN
	select l.* from loan l inner join
    `loan-active` la on l.idLoan=la.idLoan
    and la.idActive =idActive;
END$$

DELIMITER ;
USE `db_control_inventario`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `db_control_inventario`.`active_AFTER_UPDATE`
AFTER UPDATE ON `db_control_inventario`.`active`
FOR EACH ROW
BEGIN
	IF OLD.isLoan = 1 THEN BEGIN
		delete from `loan-active` where idActive=Old.idActive;
	END; END IF;
END$$

USE `db_control_inventario`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `db_control_inventario`.`edifice_AFTER_UPDATE`
AFTER UPDATE ON `db_control_inventario`.`edifice`
FOR EACH ROW
BEGIN
	IF OLD.isEnabled = 1 THEN BEGIN
		update area set isEnabled = 0 where idEdifice = Old.idEdifice;
	END; END IF;
    IF OLD.isEnabled = 0 THEN BEGIN
		update area set isEnabled = 1 where idEdifice = Old.idEdifice;
	END; END IF;
    
END$$

USE `db_control_inventario`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `db_control_inventario`.`loan-active_AFTER_DELETE`
AFTER DELETE ON `db_control_inventario`.`loan-active`
FOR EACH ROW
BEGIN
 delete from loan where idLoan = Old.idLoan;
END$$


DELIMITER ;

insert into `user` values(null,"admin","admin","adminControlInventariosrgu@gmail.com");
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

