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

Insert 태그를 사용하는 장점은 foreach 태그를 사용할 수 있다는 것 (selectKey 태그는 안됨)

```xml
<insert id="insertUser" parameterType="list" useGeneratedKeys="true" keyProperty="id">
  INSERT INTO user(name)
  VALUES
  <foreach collection="list" item="user" open="(" close=")" separator=",">
    #{user.name}
  </foreach>
  
</insert>
```

