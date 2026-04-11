/* GET /api/health */
/* Aucun acces base de donnees */



/* GET /api/watches =========================================================== */
SELECT COUNT(*) FROM watch;

SELECT * FROM watch 
WHERE movement = :movement AND 
      materials = :materials AND 
      TRUNCATE(diameter, 0) = TRUNCATE(:diameter, 0) AND 
      brand = :brand AND 
      retailPrice >= :minRetailPrice AND 
      retailPrice <= :maxRetailPrice AND 
      marketPrice >= :minMarketPrice AND 
      marketPrice <= :maxMarketPrice
ORDER BY watchId ASC LIMIT :limit OFFSET :offset;

/* GET /api/watches/:id ======================================================= */
SELECT * FROM watch WHERE watchId = :id;

/* GET /api/watches/filter ==================================================== */
SELECT movement
FROM watch
WHERE movement IS NOT NULL AND movement != ''
GROUP BY movement
ORDER BY movement ASC;

SELECT materials
FROM watch
WHERE materials IS NOT NULL AND materials != ''
GROUP BY materials
ORDER BY materials ASC;

SELECT DISTINCT TRUNCATE(diameter, 0) AS diameter
FROM watch
WHERE diameter IS NOT NULL AND diameter != 0
ORDER BY diameter ASC;

SELECT brand
FROM watch
WHERE brand IS NOT NULL AND brand != ''
GROUP BY brand
ORDER BY brand ASC;

SELECT MIN(retailPrice) FROM watch;
SELECT MAX(retailPrice) FROM watch;
SELECT MIN(marketPrice) FROM watch;
SELECT MAX(marketPrice) FROM watch;



/* Auth helper used by protected roads ======================================== */
SELECT userId, userName, mail, isAdmin
FROM user
WHERE userId = :userId AND userName = :userName AND mail = :mail
LIMIT 1;

/* GET /api/auth/me =========================================================== */
SELECT userId, userName, mail, isAdmin
FROM user
WHERE userId = :userId
LIMIT 1;

/* POST /api/auth/login ======================================================= */
SELECT userId, userName, mail, hashPassWord, isAdmin
FROM user
WHERE userName = :userName OR mail = :userName
LIMIT 1;

/* POST /api/auth/register ==================================================== */
SELECT userId
FROM user
WHERE userName = :userName OR mail = :mail
LIMIT 1;

INSERT INTO user(userName, mail, dateOfBirth, hashPassWord, isAdmin)
VALUES (:userName, :mail, :dateOfBirth, :hashPassWord, 0);

/* POST /api/auth/refresh ===================================================== */
SELECT userId, token, expiresAt, revokedAt
FROM refresh_token
WHERE token = :token
LIMIT 1;

SELECT userId, userName, mail, isAdmin
FROM user
WHERE userId = :userId
LIMIT 1;



/* GET /api/admin/reservations ================================================ */
SELECT l.userId, l.watchId, l.loanDate AS reservationDate,
       l.returnLoanDate AS returnDate, l.isOutDelay, u.userName,
       u.mail, w.brand, w.model
FROM loan l
INNER JOIN user u ON u.userId = l.userId
INNER JOIN watch w ON w.watchId = l.watchId
ORDER BY l.loanDate DESC, l.returnLoanDate DESC;

/* POST /api/admin/watches ==================================================== */
SELECT idShelf
FROM shelf
WHERE idShelf = :idShelf
LIMIT 1;

INSERT INTO watch(
    idShelf, brand, model, watchDesc, watchCollection,
    imageUrl, retailPrice, marketPrice, isInProduction,
    movement, diameter, materials, watertightness, isActif
) VALUES (
    :idShelf, :brand, :model, :watchDesc, :watchCollection,
    :imageUrl, :retailPrice, :marketPrice, :isInProduction,
    :movement, :diameter, :materials, :watertightness, :isActif
);

SELECT * FROM watch WHERE watchId = :watchId LIMIT 1;

/* PUT /api/admin/watches/:id ================================================= */
SELECT watchId FROM watch WHERE watchId = :watchId LIMIT 1;

SELECT idShelf
FROM shelf
WHERE idShelf = :idShelf
LIMIT 1;

UPDATE watch SET
    idShelf = :idShelf,
    brand = :brand,
    model = :model,
    watchDesc = :watchDesc,
    watchCollection = :watchCollection,
    imageUrl = :imageUrl,
    retailPrice = :retailPrice,
    marketPrice = :marketPrice,
    isInProduction = :isInProduction,
    movement = :movement,
    diameter = :diameter,
    materials = :materials,
    watertightness = :watertightness,
    isActif = :isActif
WHERE watchId = :watchId;

SELECT * FROM watch WHERE watchId = :watchId LIMIT 1;

/* DELETE /api/admin/watches/:id ============================================== */
SELECT watchId FROM watch WHERE watchId = :watchId LIMIT 1;

UPDATE watch SET isActif = 0 WHERE watchId = :watchId;



/* POST /api/reservations ===================================================== */
SELECT watchId
FROM watch
WHERE watchId = :watchId AND isActif = 1
LIMIT 1;

SELECT userId
FROM loan
WHERE watchId = :watchId AND returnLoanDate >= CURRENT_DATE
LIMIT 1;

SELECT user.isPremium, COUNT(loan.watchId) AS activeReservations
FROM user
LEFT JOIN loan USING (userId)
WHERE userId = :userId AND loan.returnLoanDate >= CURRENT_DATE
GROUP BY userId;

INSERT INTO loan(userId, watchId, loanDate, returnLoanDate)
VALUES (:userId, :watchId, CURRENT_DATE, :returnLoanDate);

SELECT userId, watchId, loanDate AS reservationDate, returnLoanDate AS returnDate
FROM loan
WHERE userId = :userId AND watchId = :watchId
LIMIT 1;

SELECT COUNT(*) AS totalReservations
FROM loan
WHERE watchId = :watchId;

UPDATE user SET isPremium = 1 WHERE userId = :userId;



/* POST /api/contact ========================================================== */
INSERT INTO contact(surname, name, email, tel, message)
VALUES (:surname, :name, :email, :tel, :message);
