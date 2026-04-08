/* GET /api/health */

/* GET /api/watches */
select * frow watch;

/* GET /api/watches/:id */
select * frow watch where watchId = 1;

/* ---- */

/* GET /api/admin/reservations */
select * from resevation where isAdmin = 1;

/* GET /api/admin/watches */
select * from watch where isAdmin = 1;

/* GET /api/auth/me */
select * from user where userId = ;

/* POST /api/reservations */
insert into reservations(loanDate, returnLoanDate, isOutDelay)
values('','','')


/* POST /api/admin/watches */
insert into (
    watchId,isActif,watchCollection,model,watchCollection,imageUrl,
    retailPrice,marketPrice,isInProduction,materials,diameter,watertightness
    )
values(
    '','','','',
    '','','','',
    '','','',''
)

/* PUT /api/admin/watches/:id */
update watch set model, watchCollection, imageUrl, retailPrice, isInProduction  where watchId = 1

/* DELETE /api/admin/watches/:id */
update watch set isActif = True where watchId = ;




