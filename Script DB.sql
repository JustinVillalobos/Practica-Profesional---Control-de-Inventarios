drop database db_control_inventario;
create database db_control_inventario;

use db_control_inventario;

create table edifice(
	idEdifice smallint primary key auto_increment,
    `name` varchar(125) NOT NULL,
    isEnabled boolean not null
);

create table area(
	idArea smallint primary key auto_increment,
    `name` varchar(125) NOT NULL,
     isEnabled boolean not null,
    idEdifice smallint NOT NULL,
    foreign key(idEdifice) references edifice(idEdifice)
);
create table `active`(
	idActive smallint primary key auto_increment,
    `name` varchar(150) NOT NULL,
    licensePlate varchar(100) ,
    `description` varchar(300) NOT NULL,
    mark varchar(50) ,
    model  varchar(50) ,
    `serie`  varchar(50),
    amount smallint NOT NULL,
    isLoan boolean not null
);
create table `area-active`(
	idActive smallint NOT NULL,
	idArea smallint NOT NULL,
      foreign key(idArea) references area(idArea),
      foreign key(idActive) references `active`(idActive)
);

create table loan(
	idLoan int primary key auto_increment,
    `name` varchar(150) NOT NULL,
    loanDate datetime NOT NULL
);

create table `loan-active`(
	idLoan int  NOT NULL,
    idActive smallint NOT NULL,
    primary key(idLoan,idActive),
    foreign key(idLoan) references loan(idLoan),
     foreign key(idActive) references `active`(idActive)
);
create table `user`(
	idUser tinyint primary key auto_increment,
    username varchar(50) NOT NULL,
    `password` varchar(20) not null,
    email varchar(45) not null
);

USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_session`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_session` (
	in `user` varchar(50),
    in `psw` varchar(20)
)
BEGIN
	Select idUser from `user` where username = `user` and
    `password` = `psw`;
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_all_edifices`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_all_edifices` ()
BEGIN
	select idEdifice,`name`,isEnabled from edifices;
END$$

DELIMITER ;

USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_add_edifice`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_add_edifice` (
	in `new_edifice_name` varchar(125)
)
BEGIN
	insert into edifice value(null,`new_edifice_name`,true);
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_edit_edifice`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_edit_edifice` (
in id smallint,
in `new_edifice_name` varchar(125)
)
BEGIN
	update edifice set `name` = `new_edifice_name` where idEdifice = id;
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_edit_status`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_edit_status` (
in id smallint,
in `status` varchar(125)
)
BEGIN
	update edifice set isEnabled = `status` where idEdifice = id;
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_all_areas`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_all_areas` ()
BEGIN
	select a.idArea, a.`name`, a.isEnabled,e.`name` as edifice from area a
    inner join edifice e on a.idEdifice = e.idEdifice;
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_all_area_edificio`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_all_area_edificio` (
	in id smallint
)
BEGIN
select a.idArea, a.`name`, a.isEnabled,e.`name` as edifice from area a
    inner join edifice e on a.idEdifice = e.idEdifice and e.idEdifice = id;
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_add_area`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_add_area` (
	in `name` varchar(125),
    in idEdifice smallint
)
BEGIN
	insert into area values(null,`name`,true,idEdifice);
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_edit_area`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_edit_area` (
	in id smallint, 
	in `new_name` varchar(125),
    in new_idEdifice smallint
)
BEGIN
	update area set `name`= `new_name`, idEdifice = new_idEdifice
    where idArea = id;
END$$

DELIMITER ;
USE `db_control_inventario`;
DROP procedure IF EXISTS `sp_edit_area_status`;

DELIMITER $$
USE `db_control_inventario`$$
CREATE PROCEDURE `sp_edit_area_status` (
	in id smallint, 
	in `status` boolean
)
BEGIN
update area set isEnabled= `status`
    where idArea = id;
END$$

DELIMITER ;



/*  User System*/
insert into `user` values(null,"admin","admin","admin.ucr@ucr.ac.cr");

/*  Example row edifices*/
insert into edifice values(null,"Edificio Administrativo",true);
insert into edifice values(null,"Aulas",true);
insert into edifice values(null,"Laboratorios",true);
insert into edifice values(null,"Biblioteca",true);

/*  Example row areas*/
insert into area values(null,"Area Psicologia",true,1);
insert into area values(null,"Laboratorio 1",true,3);
insert into area values(null,"Laboratorio 2",true,3);
insert into area values(null,"Aula 7",true,2);

/*  Example row actives*/
insert into `active` value(null,"Activo 1","","Es un activo","","","",20,1);
insert into `active` value(null,"Activo 2","","Es un activo","","","",20,2);
insert into `active` value(null,"Activo 3","","Es un activo","","","",20,3);
insert into `active` value(null,"Activo 4","","Es un activo","","","",20,1);
insert into `active` value(null,"Activo 6","","Es un activo","","","",20,1);

call sp_session("admin","admin");
call sp_all_edifices();
call sp_add_edifice('Dormitorio Universitario');
-- call sp_edit_edifice(1,'');
-- call sp_edit_status(1,false);
call sp_all_areas();

call sp_all_area_edificio(2);
-- call sp_add_area("Laboratorio 3",3);
-- call sp_edit_area(5,"Laboratorio Grande",3);
-- call sp_edit_area_status(5,false);
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by 'root';