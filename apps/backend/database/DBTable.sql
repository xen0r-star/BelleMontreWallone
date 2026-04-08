SET LC_TIME_NAMES = 'fr_BE';
CREATE DATABASE IF NOT EXISTS watch_store CHARACTER SET = 'utf8mb4';
USE watch_store;

CREATE TABLE IF NOT EXISTS user(
    userId INT AUTO_INCREMENT NOT NULL,
    userName VARCHAR(50) NOT NULL,
    mail VARCHAR(90) NOT NULL,
    dateOfBirth DATE NOT NULL,
    hashPassWord VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT 0,

    PRIMARY KEY (userId)
)engine=innodb;

CREATE TABLE IF NOT EXISTS refreshToken(
    tokenId INT AUTO_INCREMENT NOT NULL,
    userId INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revokedAt TIMESTAMP NULL,

    PRIMARY KEY (tokenId),
    KEY(userId),
    KEY(expiresAt)
)engine=innodb;

CREATE TABLE IF NOT EXISTS city (
    idCity VARCHAR(255) NOT NULL,
    cityName VARCHAR(255) NOT NULL,

    PRIMARY KEY (idCity)
)engine=innodb;

CREATE TABLE IF NOT EXISTS store (
    idStore CHAR(12) NOT NULL,
    storeName VARCHAR(255) NOT NULL,
    idCity VARCHAR(255) NOT NULL,

    PRIMARY KEY (idStore),
    KEY(idCity)
)engine=innodb;

CREATE TABLE IF NOT EXISTS watchCabinet (
    idWatchCabinet CHAR(12) NOT NULL,
    idStore CHAR(12) NOT NULL,
    positionInStore VARCHAR(4) NOT NULL,
    cabinetName VARCHAR(255) NOT NULL,

    PRIMARY KEY (idWatchCabinet),
    KEY(idStore)
)engine=innodb;

CREATE TABLE IF NOT EXISTS shelf (
    idShelf CHAR(12) NOT NULL,
    idWatchCabinet CHAR(12) NOT NULL,
    positionInCabinet VARCHAR(4) NOT NULL,

    PRIMARY KEY (idShelf),
    KEY(idWatchCabinet)
)engine=innodb;

CREATE TABLE IF NOT EXISTS watch (
    watchId INT AUTO_INCREMENT NOT NULL,
    idShelf CHAR(12) NOT NULL,
    model VARCHAR(255) NOT NULL,
    watchCollection VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    retailPrice NUMERIC(10,2),
    marketPrice NUMERIC(10,2) NOT NULL,

    isInProduction BOOLEAN DEFAULT 1,
    materials VARCHAR (255),
    diameter NUMERIC(5,2),
    watertightness VARCHAR(50),

    PRIMARY KEY (watchId),
    KEY(idShelf)
)engine=innodb;

CREATE TABLE IF NOT EXISTS loan(
    userId INT NOT NULL,
    watchId INT NOT NULL,
    loanDate DATE DEFAULT (CURRENT_DATE),
    returnLoanDate DATE NOT NULL,
    isOutDelay BOOLEAN,

    PRIMARY KEY (userId, watchId)
)engine=innodb;


CREATE TABLE IF NOT EXISTS contact(
    contactId INT AUTO_INCREMENT NOT NULL,
    surname VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tel VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (contactId)
)engine=innodb;


ALTER TABLE refreshToken 
ADD CONSTRAINT fx_refreshToken_userId FOREIGN KEY (userId) REFERENCES user(userId);

ALTER TABLE store
ADD CONSTRAINT fk_idCity FOREIGN KEY (idCity) REFERENCES city(idCity);

ALTER TABLE watchCabinet
ADD CONSTRAINT fk_idStore FOREIGN KEY (idStore) REFERENCES store(idStore);

ALTER TABLE shelf
ADD CONSTRAINT fk_idWatchCabinet FOREIGN KEY (idWatchCabinet) REFERENCES watchCabinet(idWatchCabinet);

ALTER TABLE watch
ADD CONSTRAINT fk_idShelf FOREIGN KEY (idShelf) REFERENCES shelf(idShelf);

ALTER TABLE loan 
ADD CONSTRAINT fk_userId FOREIGN KEY (userId) REFERENCES user(userId),
ADD CONSTRAINT fk_watchId FOREIGN KEY (watchId) REFERENCES watch(watchId);
