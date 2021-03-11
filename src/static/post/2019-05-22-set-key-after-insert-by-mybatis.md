매번 프로젝트에 myBatis를 사용하다가 JPA로 넘어가면서 굳이 엔티티를 만들어서 persistence 관리를 하도록 해야되는가에 대한 생각이 많았는데, insert 쿼리를 실행하면서 persistence의 소중함을 깨닫는 계기가 되었습니다.

어떤 엔티티의 아이디가 auto increment 를 사용해서 DB에서 아이디를 생성하도록 하는 경우 JPA의 경우 persistence가 존재하기 때문에 `save()` 메서드 호출 후 id가 PersistenceManager에 의해 엔티티의 프로퍼티에 설정됩니다. 하지만 myBatis에 경우엔 그렇지 않는데, 이를 처리하기 위한 태그를 정리해 보았습니다.

# SelectKey 태그 사용하기

## insert 전에 특정 값을 이용해 처리하는 방법

```xml
<insert id="insertUser" parameterType="User">
	<selectKey resultType="string" keyProperty="id" order="BEFORE">
  	SELECT MAX(id)+1 FROM user
  </selectKey>
  INSERT INTO user(id, name)
  VALUES(#{id}, #{name})
</insert>
```

## Insert 후에 특정값을 사용하는 방법

 ```xml
<insert id="insertUser" parameterType="User" useGeneratedKeys="true">
  INSERT INTO user(name)
  VALUES(#{name})
	<selectKey resultType="long" keyProperty="id" order="AFTER">
  	SELECT LAST_INSERT_ID()
  </selectKey>
</insert>
 ```



# Insert 태그의 propertyKey 옵션 사용하기

```xml
<insert id="insertUser" parameterType="User" useGeneratedKeys="true" keyProperty="id">
  INSERT INTO user(name)
  VALUES(#{name})
</insert>
```

Insert 태그를 사용하는 장점은 foreach 태그를 사용할 수 있다는 것입니다. (selectKey 태그는 안됨)

```xml
<insert id="insertUser" parameterType="list" useGeneratedKeys="true" keyProperty="id">
  INSERT INTO user(name)
  VALUES
  <foreach collection="list" item="user" open="(" close=")" separator=",">
    #{user.name}
  </foreach>
  
</insert>
```

