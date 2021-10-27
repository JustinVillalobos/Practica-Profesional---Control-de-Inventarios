create database db_control_inventario;

use db_control_inventario;

create table edifice(
	idEdifice smallint primary key auto_increment,
    `name` varchar(125) NOT NULL
);

create table area(
	idArea smallint primary key auto_increment,
    `name` varchar(125) NOT NULL,
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
    idArea smallint NOT NULL,
      foreign key(idArea) references area(idArea)
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

/*  User System*/
insert into `user` values(null,"JustinVillalobos","Justin1234*","Justin.Villalobos@ucr.ac.cr");

/*  Example row edifices*/
insert into edifice values(null,"Edificio 1");
insert into edifice values(null,"Edificio 2");
insert into edifice values(null,"Edificio 3");
insert into edifice values(null,"Edificio 4");

/*  Example row areas*/
insert into area values(null,"Area 1",1);
insert into area values(null,"Area 2",1);
insert into area values(null,"Area 3",2);
insert into area values(null,"Area 4",3);

/*  Example row actives*/
insert into `active` value(null,"Activo 1","","Es un activo","","","",20,1);
insert into `active` value(null,"Activo 2","","Es un activo","","","",20,2);
insert into `active` value(null,"Activo 3","","Es un activo","","","",20,3);
insert into `active` value(null,"Activo 4","","Es un activo","","","",20,1);
insert into `active` value(null,"Activo 6","","Es un activo","","","",20,1);

Select a.name from `active` a inner join area ar on a.idArea=ar.idArea
inner join edifice e on ar.idEdifice=e.idEdifice and e.idEdifice=1;

Select ar.name from area ar 
inner join edifice e on ar.idEdifice=e.idEdifice and e.idEdifice=1;