3장에선 스프링에 적용된 템플릿 기법을 살펴본다. 객체지향 설계의 핵심인 개방 폐쇄 원칙<sup>OCP:Open Closed Principal</sup>을 위해, 변경이 거의 일어나지 않는 부분을 자유롭게 변경이 되는 부분으로 부터 독립시키는 방법인 템플릿을 살펴보고, 이를 적용해 완성도 있는 DAO 코드를 작성하는 법을 알아본다.

 일반적으로 서버에선 제한된 갯수의 DB 커넥션을 만들어서 재사용 가능한 풀로 관리한다. DB 풀의 커넥션은 close() 메서드를 통해 풀로 반환해햐하는데, 오류때문에 미처 반환하지 못한 커넥션이 쌓이면 어느 순간 커넥션 풀에 여유가 없어지고 오류를 내며 서버가 중단 될 수 있다. 그래서 어떠한 상황에도 리소스를 반환하도록 try/catch/fianlly 구문의 사용을 권장한다.

 하지만 커넥션이 사용될 때마다 try/catch/fianlly 구문을 사용하면 **복잡한 구문이 메서드 마다 반복되는 문제점이 있다. 이런 코드는 처음에 완벽히 작성하더라도 나중에 폭탄이 될 가능성을 지니고 있다.** 

## 메서드로 추출

 변하는 부분을 변하지 않는 부분에서 메서드로 추출하는 방법을 생각할 수 있다. 하지만 변하지 않는 커넥션을 얻고 이를 반납하는 부분이 변하는 부분, 쿼리를 실행하는 부분을 호출하고 있기 때문에 메서드로 추출하더라도 변하지 않는 부분을 재사용할 수 없다.

```java
public void deleteAll() throws SQLException {
    try {
        c = this.dataSource.getConnection();
        
        ps = makeStatement(c);
        
        ps.executeUpdate();
    } catch (SQLException e) {
        ...
    }
}

public PreparedStatement makeStatement(Connection c) {
    PreparedStatement ps = c.prepareStatement("delete from users");
    return ps;
}
```

## 템플릿 메서드 패턴 적용

 템플릿 메서드 패턴은 변하지 않는 부분을 슈퍼 클래스에 두고 변하는 부분을 추상 메서드로 정의한 뒤, 상속을 통해 기능을 확장해서 사용하는 패턴이다. 

![3-1](https://user-images.githubusercontent.com/18159012/38455545-ab005c06-3ab4-11e8-9635-e6678f98c26e.png)

 하지만 이 방식은 위에서 보이는 것 처럼 **DAO 로직마다 상속을 통해 새로운 클래스를 만들어야한다. 또한 확장 구조가 클래스를 설계하는 시점에서 고정이 되어버린다는 단점도 있다. 이는 템플릿 메소드 패턴의 단점이기도 하다.**

```java
public class UserDaoDeleteAll extends UserDao {
    
    protected PreparedStatement makeStatement(Connection c) throws SQLException {
        PreparedStatement ps = c.prepareStatement("delete from users");
        return ps;
    }
}
```

## 전략 패턴 적용

 개방 폐쇄 원칙을 잘 지키는 구조이면서도 템플릿 메소드 패턴보다 유연하고 확장성이 뛰어난 것이, 오브젝트를 아예 따로 분리하고 클래스 레벨에서는 인터페이스를 통해서만 의존하도록 만드는 전략 패턴이다.

![3-2](https://user-images.githubusercontent.com/18159012/38455549-ba13d27c-3ab4-11e8-9381-9e08b467d973.png)

 하지만 컨텍스트가 인터페이스뿐 아니라 구체적 구현 클래스를 알고 있다는 것 또한 전략패턴에도, 개방 폐쇄 원칙에도 들어맞지 않는다.

 이 문제를 해결하기 위해선 전략 패턴에서의 클라이언트의 역할을 살펴볼 필요가 있다. 일반적으로 전략 패턴에선 어떤 전략을 사용할 것인가는 컨텍스트를 사용하는 클라이언트가 결정하는게 일반적이다.

![3-3](https://user-images.githubusercontent.com/18159012/38455551-c4805776-3ab4-11e8-8101-7d5dc5b78066.png)

 이를 활용해 클라이언트가 컨텍스트를 사용할 때 필요한 전략을 제공해 컨텍스트가 구체적인 구현 클래스를 알 필요 없이 클라이언트가 제공하는 전략을 사용하도록 할 수 있다.

```java
public interface StatementStrategy {
    PreparedStatement makePreparedStatement(Connection c) throws SQLException;
}
```

```java
public class DeleteAllStatement implements StatementStrategy {
    public PreparedStatement makePreparedStatement(Connection c) throws SQLException {
        PreparedStatement ps = c.prepareStatement("delete from users");
        return ps;
    }
}
```

```java
public void deleteAll() throws SQLException {
    StatementStrategy st = new DeleteAllStatement();
    jdbcContextWithStrategy(st);
}

public void jdbcContextWithStrategy(StatementStrategy stmt) throws SQLException {
    Connection c = null;
    PreparedStatement ps = null;
    
    try {
        c = this.dataSrouce.getConnection();
        
        ps = stmt.makePreparedStatement(c);
        
        ps.executeUpdate();
    } catch (SQLException e) {
        throw e;
    } finally {
        if (ps != null) { try { ps.close(); } catch (SQLException e) {} }
        if (c != null) { try { c.close(); } catch (SQLException e) {} }
    }
}
```



# 전략 패턴 최적화

 앞서 설명한 전략 패턴에는 개선할 부분이 있다. 바로 DAO 메서드마다 새로운 전략을 구현한 클래스를 만들어야 한다는 것이다. 또한 전략 클래스에 전달할 부가적인 정보가 있는 경우, 이를 위해 오브젝트를 전달받는 생성자와 인스턴스 변수를 번거롭게 만들어야한다는 것이다.

## 로컬 클래스

 클래스 파일이 많아지는 문제를 해결하기 위한 간단한 해결 방법이 있다. 독립된 파일로 만들지 말고 메서드 안에서 로컬 클래스로 정의하는 것이다. DAO에서 사용하는 전략 클래스의 경우 DAO의 메서드마다 사용되기 때문에 외부에서 사용되지 않는다. 때문에 내부 클래스로 정의 하더라도 문제가 되지 않는다.

 덕분에 클래스 파일이 하나 줄일 수 있고, 메서드와 전략 클래스의 로직을 함께 볼 수 있어 코드를 이해하기도 좋다. 뿐만 아니라 내부 클래스에서 자신이 선언된 곳의 로컬 변수에 직접 접근할 수 있다는 장점이 있다.

```java
public void add(User user) throws SQLException {
    class AddStatement implements StatementStrategy {
        public PreparedStatment makePreparedStatement(Connection c) throws SQLException {
            PreparedStatement ps = c.preparedStatement("insert into users(id, name, password) values(?,?,?)");
            ps.setString(1, user.getId());
            ps.setString(2, user.getName());
            ps.setString(3, user.getPassword());
            return ps;
        }
    }
    
    StatementStrategy st = new AddStatement();
    jdbcContextWithStrategy(st);
}
```

## 익명 내부 클래스

 좀 더 나아가 클래스 이름조차 필요없는 익명 내부 클래스를 사용하는 방법이 있다. 익명 내부 클래스는 선언과 동시에 오브젝트를 생성한다. 이름이 없기 때문에 클래스 자신의 타입을 가질 수 없고, 구현한 인터페이스 타입의 변수에만 저장할 수 있다. 이렇게 선언된 익명 내부 클래스의 오브젝트는 딱 한 번만 사용될 테니 굳이 변수에 담아서 사용하지 않고, 파라메터로 바로 넘겨주는 편이 낫다.

```java
public void add(User user) throws SQLException {
    jdbcContextWithStrategy(new StatementStrategy() {
        public PreparedStatment makePreparedStatement(Connection c) throws SQLException {
            PreparedStatement ps = c.prepareStatement("insert into users(id, name, password) values(?,?,?)");
            ps.setString(1, user.getId());
            ps.setString(2, user.getName());
            ps.setString(3, user.getPassword());
            return ps;
        }
    });
}
```

# 컨텍스트와 DI

 앞서 만들어진 컨텍스트 메서드는 JDBC의 일반적인 작업 흐름을 담고 있기 때문에 한 DAO에서 뿐만 아니라 다른 여러 DAO에서도 사용이 가능하다. 때문에 클래스 밖으로 독립시켜 모든 DAO가 사용할 수 있게 만들 수 있다.

##  클래스의 분리

 컨텍스트 메서드를 분리하여 JdbcContext로 분리한다. 이렇게 하면 JDBC에 대한 DataSource를 필요로 하는 것은 DAO 클래스가 아니라 DB 커넥션을 필요로 하는 코드를 담고 있는 JdbcContext가 되게 된다. 때문에 JdbcContext에서 DataSource 타입 빈을 DI 받을 수 있게 해줘야한다.

## 스프링을 통한 DI

분리된 클래스인 JdbcContext가 DAO와 인터페이스를 사용하지 않는 직접적인 의존관계를 갖는다. 그러나 DI를 넓게 보면 JdbcContext를 스프링을 이용해 인젝션한다 해도 DI의 기본을 따르고 있다고 볼 수 있다.

![3-5](https://user-images.githubusercontent.com/18159012/38455734-50830a28-3ab7-11e8-8a42-e5466b394980.png)

인터페이스를 통해 자유롭게 변경이 가능하진 않지만 빈으로 만들어져 스프링 DI를 적용해야 할 이유를 생각해보자.

1. 분리된 클래스가 싱글톤 레지스트리에서 관리되는 싱글톤 빈이 되기 때문이다.
2. 분리된 클래스가 DI를 통해 다른 빈에 의존하기 때문이다.

인터페이스가 없다는건 강한 의존 결합된다는 의미다. 다른 방식을 사용해야하는 경우 의존을 갖는 클래스가 통째로 바뀌어야 하므로 굳이 인너페이스를 쓸 필요가 없다. 하지만 이렇게 클래스를 바로 사용하는 코드 구성을 DI에 적용하는 것은 가장 마지막 단계에서 고려할 사항이다.

 **실제 의존관계가 설정파일에 명확히 드러난다는 장점이 있지만 DI의 근본적인 원칙에 부합하지 않는 구체적인 클래스와의 관계가 설정에 노출된다는 단점이 있다.**

## 수동 DI

 스프링 빈을 사용하는 방법 대신 클라리언트 클래스에서 직접 DI를 적용하는 방법이 있다. 조금만 타협해서 DAO마다 하나의 JdbcContext 오브젝트를 갖고 있게 하는 것이다. DAO 메서드에서 만들어서 사용하면 수백만의 오브젝트가 생성되겠지만, DAO마다 하나씩이라면 크게 문제가 되진 않는다.

 JdbcContext가 DataSource 빈을 의존하고 있기 때문에, 직접 JdbcContext를 사용하더라도 DataSource 빈을 주입받아야한다. 이런 경우에 클라이언트에게 JdbcContext의 제어권을 주고 DI 컨테이너처럼 동작하게 만들면 된다.

![3-6](https://user-images.githubusercontent.com/18159012/38455737-5c3a6096-3ab7-11e8-876e-2f59b39b21d8.png)

 이 방법은 긴밀한 관계를 갖는 DAO와 JdbcContext를 굳이 어색하게 빈으로 분리하지 않고 내부에서 직접 사용하면서도 다른 오브젝트에 대한 DI를 적용할 수 있다. **어색한 관계가 설정파일에 드러나지 않지만, JdbcContext를 여러 오브젝트가 사용하더라도 싱글톤으로 만들 수 없고, DI 작업을 위한 부가적인 코드가 필요하다는 단점이 있다.**

# 템플릿과 콜백

 앞서 적용한 전략 패턴의 익명 내부 클래스를 활용한 방식을 스프링에선 템플릿/콜백 패턴이라고 한다. 

> 템플릿
>
> 고정된 틀 안에 바꿀 수 있는 부분을 넣어서 사용하는 경우에 템플릿이라고 한다. 템플릿 메소드 패턴은 고정된 틀의 로직을 가진 템플릿 메소드를 슈퍼클래스에 두고, 바뀌는 부분을 서브 클래스의 메소드에 두는 구조로 이뤄진다.
>
> 콜백
>
> 실행되는 것을 목적으로 다른 오브젝트의 메소드에 전달되는 오브젝트를 말한다. 파라메터로 전달되지만 값을 전달하는 목적이 아닌 특정 로직을 담은 메소드를 실행시키기 위해 사용된다. 자바에선 파라메터로 메소드 자체를 넘길 수 없기 때문에 메소드가 선언된 **오브젝트**를 전달해야 한다. 그래서 함수형 오브젝트(Funtional Object)라고도 한다.

 일반적인 DI라면 템플릿에 인스턴스 변수를 만들어 두고 사용할 의존 오브젝트를 수정자 메소드로 받아서 사용한다. 반면 템플릿/콜백 패턴에서는 매번 메소드 단위로 사용할 오브젝트를 새롭게 전달받는다는 것이 특징이다.

![3-7](https://user-images.githubusercontent.com/18159012/38455763-c1b59670-3ab7-11e8-95d9-d80906bd0860.png)

## 콜백의 재활용

 템플릿/콜백 패턴에는 한 가지 아쉬는 점이 있다. DAO 메소드에서 매번 익명 내부 클래스를 사용하기 때문에 코드를 읽기가 조금 불편하다는 것이다. 분리를 통해서 재사용이 가능한 코드를 찾아낼 수 있다면 익명 내부 클래스를 사용한 코드를 간결하게 만들 수 있다. 

```java
public void deleteAll() throws SQLException {
    this.jdbcContext.workStatementStrategy(
        new StatementStrategy () {
            public PreparedStatement makePreparedStatement(Connection c) throws SQLException {
                return c.prepareStatement("delete form users");
            }
        }
    );
}
```

 전략 클래스에서 변하는 부분은 SQL 문장 뿐이다. SQL 문장을 제외한 템플릿/콜백 코드는 예로든 deleteAll() 메서드 뿐만 아니라 다른 DAO 메서드에서 반복될 가능성이 높다. 때문에 SQL 문장만 파라메터로 받아 바꿀 수 있게하고 메서드 전체를 분리하여 별도의 메서드로 만들 수 있다.

```java
public void deleteAll() throws SQLException {
    executeSql("delete from uses");
}

private void executeSql(String query) throws SQLException {
    this.jdbcContext.workStatementStrategy(
        new StatementStrategy () {
            public PreparedStatement makePreparedStatement(Connection c) throws SQLException {
                return c.prepareStatement(query);
            }
        }
    );
}
```

 이렇게 수정하면 모든 고정된 SQL 문을 실행하는 DAO 메서드는 deleteAll() 메서드처럼 executeSql() 메서드를 호출하면 된다. 이렇게 재사용 가능한 콜백을 담고 있는 메소드라면 DAO가 공유할 수 있는 템플릿 클래스인 JdbcContext 클래스로 옮겨도 된다.

```java
public class JdbcContext {
    
    public void executeSql(String query) throws SQLException {
        workWithStatementStrategy (
            new StatementStrategy() {
                public PreparedStatement makePreparedStatement(Connection c) {
                    return e.prepareStatement(query);
                }
            }
        );
    }
}
```

```java
public void deleteAll() throws SQLException {
    this.jdbcContext.executeSql("delete from users");
}
```

 일반적으로 성격이 다른 코드들은 가능한 한 분리하는 편이 낫지만, 이 경우엔 **하나의 목적을 위해 서로 긴밀하게 연관되어 동작하는 코드들이기 때문에 한 군데 모여있는 게 유리하다.** 구체적인 구현과 내부의 전략 패턴, 코드에 의한 DI, 익면 내부 클래스 등의 기술은 최대한 감추고, 외부에는 꼭 필요한 기능을 제공하는 단순한 메소드만 노출하는 것이다.  SQL 문장에 인자가 필요한 경우, 파라메터로 가변인자를 사용하여 적용하면 된다.

# 스프링의 JdbcTemplate

 스프링은 JDBC를 이용하는 DAO에서 사용할 수 있도록 준비된 다양한 템플릿과 콜백을 제공한다. JDBC의 경우 기본으로 제공하는 템플릿은 JdbcTemplate이다. 앞서 구현한 JdbcContext와 유사하지만 **JdbcTemplate은 훨씬 강력하고 편리한 기능을 제공한다.**

## update()

 템플릿에 쿼리문을 직접 건네 주어 실행하는 기능을 제공하는 메소드이다. SQL 문장에 인자가 필요한 경우 가변인자를 통해 순서대로 바인딩한 파라메터를 넘겨주면 된다.

```java
public void insertUser(String id, String name, String password) {
    this.jdbcTemplate.update("insert into users(id, name, password) vlaues(?,?,?)",
                             id, name, password);
}
```

## queryForInt()

 쿼리의 결과를 반환받기 위한 ResultSetExtractor 콜백을 작성할 필요없이 결과의 갯수를 반환하는 기능을 제공하는 메소드이다.

```java
public int getCount() {
    return this.jdbcTemplate.queryForInt("select count(*) from users");
}
```

## queryForObject()

getCount() 메소드처럼 단순한 값이 아니라 복잡한 오브젝트를 만들어주는 메소드이다. SQL 문을 실행해서 받은 결과 로우의 갯수가 하나가 아니라면 EmptyResultDataAccessException이 던져지도록 만들어져 있다.

```java
public User get(String id) {
    return this.jdbcTemplate
               .queryForObject("select from users where id = ?",
                               new Object[] {id},
                               new RowMapper<User>() {
                                   public User mapRow(ResultSet rs, int rowNum) throws SQLException{
                                       User user = new User();
                                       user.setId(rs.getString("id"));
                                       user.setName(rs.getString("name"));
                                       user.setPassword(rs.getString("password"));
                                       return user;
                                   }
                               });
}
```

## query()

 SQL 문, PreparedStatementCreator, ResultSetExtractor 그리고 RowMapper 등을 파라메터로 받아 SQL 쿼리를 실행하는 기능을 제공한다.

```java
public void int getCount() {
    return this.jdbcTemplate.query(new PrepareStatementCreator() {
        public PreparedStatement createPreparedStatement(Connection c) throws SQLException {
            return c.prepareStatement("select count(*) from users")
        }
    }, new ResultSetExtractor<Integer>() {
        public Integer extracData(ResultSet rs) throws SQLException, DataAccessException {
            if (rs.next()) {
                // getInt(1) 에서 숫자는 1은 select문에서 첫번째 컬럼의 count를 가져오라는 의미
                return rs.getInt(1);
            } else {
                return 0;
            }
        }
    });
}
```

```java
public List<User> getAll() {
    return this.jdbcTemplate.query("select * from users order by id",
                                   new RowMapper<User>() {
                                       public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                                           User user = new User();
                                           user.setId(rs.getString("id"));
                                           user.setName(rs.getString("name"));
                                           user.setPassword(rs.getString("password"));
                                           return user;
                                       }
                                   });
}
```

 ResultSetExtractor와 RowMapper의 차이점은 실행 횟수이다. 각 콜백의 파라메터로 전달받는 ResultSet은 ResultSetExtractor에선  테이블에 대한 정보를, RowMapper의 경우 로우에 대한 정보를 받아온다. 때문에 RowMapper의 콜백 메서드는 로우의 갯수만큼 불리게 된다.