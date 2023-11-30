INSERT INTO keywords
	(keyword)
VALUES
	('svelte'),
	('skeleton')
ON CONFLICT DO NOTHING
-- bulk insert https://stackoverflow.com/questions/37300997/multi-row-insert-with-pg-promise

-- upsert an entity with m2m
--- test tables with m2m 
create table test1(test1_id bigserial not null primary key, uq_value1 text ,constraint unique_uq_val1 unique (uq_value1));

create table test2(test2_id bigserial not null primary key, uq_value2 text ,constraint unique_uq_val2 unique (uq_value2));


create table test1_test2 (test1_id bigint not null, test2_id bigint not null, 
primary key (test1_id, test2_id),
constraint fk_test1  foreign key (test1_id) references test1(test1_id ),
constraint fk_test2  foreign key (test2_id) references test2(test2_id )
);
------------------------------------
-- insert value into the first table , or do a dummy update if it's already there
with 
ins1 as 
(insert  into test1(uq_value1) values('foo') on conflict on constraint unique_uq_val1 do update 
    set  uq_value1=test1.uq_value1
returning test1_id 
)
,
-- insert value into the second table , or do a dummy update if it's already there
ins2 as 
(insert  into test2(uq_value2) values('bar') on conflict on constraint unique_uq_val2  do update 
    set  uq_value2=test2.uq_value2 
returning test2_id 
)
,
-- select PK of inserted records (since there is exactly one record in each insert,
-- cross join is used
sel_1 as 
(
select test1_id,test2_id
from ins1  
cross join ins2 
)
-- finally insert into link tables if such a record doesn't exist : 
insert into test1_test2(test1_id, test2_id)
select * from sel_1  a 
where not exists( select null from test1_test2 b where (b.test1_id, b.test2_id) = (a.test1_id, a.test2_id))