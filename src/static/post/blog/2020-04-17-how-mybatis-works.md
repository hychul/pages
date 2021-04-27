MyBatis는 직접 쿼리를 작성하여 데이터베이스를 사용할 수 있게 도움을 주는 프레임워크이다. 물론 JDBC 객체를 생성하여 직접 JDBC api를 사용할 수 있지만, 직접 데이터베이스 커넥션을 사용하여 접속하고, JDBC를 위한 쿼리를 작성하고 쿼리의 각 조건문에 변수를 대입하고 결과를 파싱하는 과정을 도와주고, 쿼리 파일을 xml로 따로 관리할 수 있다. 그렇다면 어떻게 MyBatis는 동작하고 있을까?

# MyBatis 주요 구성 요소의 Database 동작

![how-mybatis-works-0](https://user-images.githubusercontent.com/18159012/115120210-3b889280-9fe7-11eb-813d-f9537dd6d35d.jpg)

MyBatis는 persistence prodiver로써 JDBC 를 직접 사용하지 않고 MyBatis를 사용하면 MyBatis 내부에서 JDBC를 사용하여 쿼리를 실행한다.

## 어플리케이션 시작시

![how-mybatis-works-1](https://user-images.githubusercontent.com/18159012/115120494-c3bb6780-9fe8-11eb-835c-bfb71e24cf33.jpg)

해당 다이어그램은 순서대로 config 파일을 토대로 빌더를 통해 SqlSessionFactory를 생성하도록 동작하며, xml config 파일을 기준으로 작성된 다이어그램이기 때문에 해당 다이어그램은 configuration 소스코드로 대체할 수 있다.

## 클라이언트 요청 시

![how-mybatis-works-2](https://user-images.githubusercontent.com/18159012/115120499-cb7b0c00-9fe8-11eb-9fb6-cc4df4b251f6.jpg)

다이어그램에 적혀신 순서대로 동작하며, 생성된 SqlSessionFactory를 사용하여  SqlSession을 생성하고 이를 통해 매퍼와 연결된 interface를 통해 SqlSession이 매퍼의 SQL문을 실행한다.

위의 다이어그램은 interface를 통한 맵핑 방식을 기준으로 작성되어 있기 때문에 Query ID를 사용한 직접 호출 방식에선 'Mapper Interface'가 클래스로 대체될 수 있다.

# Query Mapping 방식

## Query ID 맵핑 방식

해당 방식은 statement의 id를 통해서 mapper를 직접 사용하는 방식을 말한다.

```xml
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="TestMapper">
    <select id="getTestList" resultType="io.hychul.repository.model.Test">
        SELECT 
            name, 
            TO_CHAR(created_date, 'YYYY-MM-DD') AS createdDate
        FROM 
            test
    </select>
</mapper>
```

위와 같은 맵퍼 파일이 있을때 Query ID는 namespace id와 statement id를 합친 것을 사용한다. 위의 경우엔 "TestMapper.getTotalList" 가 Query Id가 된다.

```java
@Repository
public class TestDao {

  @Autowired
  private SqlSessionTemplate sqlSession;

  public List<Test> selectList() {
    return sqlSession.selectList("TestMapper.getTotalList");
  }
}
```

## Interface 맵핑 방식

MyBatis 3.0 이후의 버전부터 사용할 수 있고 SQL Query 문을 interface 방식으로 호출한다.

```xml
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="io.hychul.repository.TestRepository">
    <select id="getTestList" resultType="io.hychul.repository.model.Test">
        SELECT 
            name, 
            TO_CHAR(created_date, 'YYYY-MM-DD') AS createdDate
        FROM 
            test
    </select>
</mapper>
```

Query Id 맵핑 방식과 비슷하지만 mapper의 namespace를 정의한 부분이 살짝 다르다. 이 쿼리 파일과 맵핑할 interface를 연결시키기 위해 전체 패키지 경로를 기술한다. 그리고 statement의 id에 해당하는 부분은 맵핑될 interface의 메서드명이 되게된다.

```java
public interface TestRepository {
    List<Test> getTestList();
}
```

> ### Reference
> Mybatis 3 : http://www.mybatis.org/mybatis-3/ko/index.html