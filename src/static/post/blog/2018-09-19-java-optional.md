자바를 사용해서 개발을 할 때 개발자들이 가장 흔하게 겪는 예외는 NPE<sup>Null Pointer Exception</sup>일 것이다. NPE는 컴파일 타임에서 확인 할 수 없어, 조심하지 않으면 갑자기 런타임에 등장한 NPE에 속수무책으로 당할 수 밖에 없다. null의 개념을 처음으로 고안한 영국의 컴퓨터 과학자인 Tony Hoare도 나중에 자신의 생각이 10억불 짜리 큰 실수[1]였고,  null 참조를 만든 것을 후회한다고 했다.

[1]: https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare 

# null 체크

null은 존재하지 않는 값을 표현하지만 그 존재하지 않는 값을 참조할 땐 문제가 된다. 아래와 같은 구조의 모델이 있다고 가정해보자.

```java
public class Location {
    public Long id;
    public Country country;
    // Getters & Setters
}

public class Continent {
    public Long id;
    public Country country;
    // Getters & Setters
}

public class Country {
    public Long id;
    public String city;
    // Getters & Setters
}
```

 어떤 위치인  `Location`가 나라와 도시에 대한 정보를 가지며, 각각의 모델들은 has a 관계로 체인을 형성한다. 이 때, 위치 모델을 통해 도시에 대한 데이터를 반환하는 메서드를 구현하면 다음과 같다.

```java
public String getCityFromLocation(Location location) {
    return location.getContinent().getCountry().getCity();
}
```

 자바에 익숙한 개발자라면 NPE 위험에 얼마나 많이 노출되어있는지 알 수 있을 것이다. 위의 코드를 NPE 발생을 회피하기 위해서 NPE에 대한 방어 코드를 추가적으로 작성해야한다.

## NPE 방어 코드

```java
public String getCiryFromLocation(Location location) {
    if (location != null) {
        Continent continent = location.getContinent();
        if (continent != null) {
            Country country = continent.getCountry();
            if (country != null) {
                String city = country.getCity();
                if (city != null) {
                    return city;
                }
            }
        }
    }
    return "Seoul";
}
```

 중첩된 if문을 통해 null 체크를 하는 일반적인 NPE 회피방법이다. 중첩으로 인해 뎁스가 생겨 코드의 가독성이 떨어지게 된다.

```java
public String getCiryFromLocation(Location location) {
    if (location == null) {
        return "Seoul";
    }

    Continent continent = location.getContinent();
    if (continent == null) {
        return "Seoul";
    }

    Country country = continent.getCountry();
    if (country == null) {
        return "Seoul";
    }

    String city = country.getCity();
    if (city == null) {
        return "Seoul";
    }

    return city;
}
```

 개인적으로 그나마 선호하는 방법으로 내부 레퍼런스에 대해 null 체크할 때마다 기본값을 리턴하며 중첩을 피하는 방법이다. 중첩 조건문을 피할 수 있지만 기본값을 리턴하는 문장이 반복되어 유지보수가 어렵다. 

```java
public String getCiryFromLocation(Location location) {
    if (location != null && 
        location.getContinent() != null && 
        location.getContinent().getCountry() != null && 
        location.getContinent().getCountry().getCity() != null) {
        return location.getContinent().getCountry().getCity();
    }

    return "Seoul";
}
```

 조건문을 하나만 사용해서 메서드를 작성했다. 조건문의 중첩과 반복은 해결했지만, 미리 받아올 수 있는 객체를 `&&`가 통과할 때마다 반복된 메서드를 호출하여 확인하게 되는 문제가 있다.

 위의 방법들 모두 객체의 메서드나 필드에 접근하기 전에 null 체크를 하여 NPE를 방지하고 있다. 하지만 NPE 방어를 하지 않는 처음의 메서드보다 코드가 상당히 지저분한 것을 볼 수 있다.

# Java 8과 Optional

 함수형 언어에선 존재할지 안할지 모르는 값을 나타내는 별도의 타입을 갖는다. 자바 8에선 함수형 언어에서 영감을 받은 여러 기능들이 추가되면서 함수형 언어가 null을 대하는 접근 방식에서 영감을 받은 `java.util.Optional<T>`라는 새로운 클래스가 추가되었다.

## Optional이란?

Optional은 Nullable한 객체를 담을 수 있는 Container 오브젝트이다. 때문에 NPE를 유발할 수 있는 null 레퍼런스를 직접 다루지 않고 이를 Optional에게 위임할 수 있다. 또한 명시적으로 해당 객체가 null일 수 있다는 가능성을 표현할 수 있기 때문에 불필요한 NPE 방어 로직을 줄일 수 있다.

## Optional의 사용

### 변수 선언

Optional은 제네릭을 제공하기 때문에 변수를 선언할 때 명시한 타입에 따라 담을 수 있는 객체의 타입이 결정된다. ~~변수를 선언할 때 'opt' 또는 'maybe' 접두사를 붙이기도 한다.~~

```java
Optional<Location> location;
Optional<Continent> optContinent;
Optional<Country> maybeCountry;
```

### 객체 생성

Optional은 public 생성자를 제공하지 않기 때문에 객체 생성을 위해 클래스에서 제공하는 3가지 정적 팩토리 메서드를 사용해야 한다.

- `Optional.empty()`

 null을 담고있는, 비어있는 Optional을리턴한다. 이 비어있는 Optional 객체는 클래스 내부에 선언된 static 변수다.

- `Optional.of(value)`

 null이 아닌 객체를 담는 Optional 객체를 리턴한다. null을 파라메터로 넘기는 경우 NPE를 발생시킨다.

- `Optional.ofNullable(value)`

 nullable한 객체를 담는 Optional 객체를 리턴한다. 내부적으로 null이 파라메터로 넘어오는 경우 `Optional.emtpy()`에서 사용된 static 변수를 리턴한다.

### 객체의 접근

 담고있는 객체를 직접 사용하기 위해선, Optional이 제공하는 메서드를 사용하여 담고있는 객체를 가져와야한다.

- `opt.get()`

 담는 객체를 반환하는 메서드로 null을 담고있는 경우 `java.util.NoSuchElementException`을 던진다. 때문에 nullable한 객체를 담고 있는 경우, Optional이 비어있는지 확인하기 위해 `opt.isPresent()` 메서드를 사용하여 확인 후 사용해야 한다.

- `opt.orElse(T other)`

 담는 객체를 반환하는 메서드로 null을 담고있는 경우 파라메터로 넘겨준 값을 대신 반환한다.

- `opt.orElseGet(Supplier<? extends T> other)`

 담는 객체를 반환하는 메서드로 null을 담고있는 경우 파라메터로 넘겨준 함수형 인터페이스를 통해 얻은 값을 대신 반환한다. `opt.orElse(T other)` 메서드와 차이점이 없어 보일 수 있지만, 대신 반환하는 `other`가 new 키워드를 통해 새로 객체를 생성하는 경우엔 조금 다르게 동작한다.

```java
public final class Optional<T> {
    ...
    public T orElse(T other) {
        return value != null ? value : other;
    }

    public T orElseGet(Supplier<? extends T> other) {
        return value != null ? value : other.get();
    }
    ...
}
```

 내부 구현을 보면 알 수 있듯이, `orElse()`의 경우 미리 객체를 생성한 후 null을 담는지 확인하지만 `orElseGet()`은 null을 담는 것을 확인한 이후에 함수형 인터페이스를 통해 null을 대신할 객체를 생성한다. 때문에 new 키워드를 사용하는 경우 `orElseGet()` 메서드를 사용하는 편이 좋다.

- `opt.orElseThrow(Supplier<? extends X> exceptionSupplier)`

 담는 객체를 반환하는 메서드로 null을 담고있는 경우 파라메터로 넘겨준 함수형 인터페이스를 통해 얻은 예외를 발생시킨다.

### 잘못된 사용

 앞서 설명한 객체를 반환하기 위한 메서드를 사용하여 앞서 구현했던 `getCiryFromLocation(Location location)`을 단순하게 구현하면 다음과 같을 것이다.

```java
public String getCiryFromLocation(Location location) {
    Optional<Location> optLocation = Optional.ofNullable(location);
    if (optLocation.isPresent()) {
        Optional<Continent> optContinent = Optional.ofNullable(optLocation.get().getContinent());
        if (optContinent.isPresent()) {
            Optional<Country> optCountry = Optional.ofNullable(continent.get().getCountry());
            if (optCountry.isPresent()) {
                Optional<String> optCity = Optional.ofNullable(optCountry.get().getCity());
                return optCity.orElse("Seoul");
            }
        }
    }
    return "Seoul";
}
```

 우리가 원했던 대로 더이상 null을 사용하지 않고 코드를 작성할 수 있게 되었다. 하지만 이것은 Optional을 제대로 사용하는 방법이 아니다. 앞서 null을 사용했던 코드만큼, 혹은 보다 더 복잡하기 때문에 Optional을 굳이 사용할 이유가 없다. Optional을 좀 더 제대로 사용하기 위해선 앞서 언급한 함수형 언어를 사용한 사고가 필요하다.

### 제대로 사용하기

 Optional은 nullable한 객체를 담는 컨테이너라고 했다. 더 직관적으로 표현하자면 최대 1개의 원소를 갖는 특수한 Stream과 같다. 또한 Stream이 갖는 `map()`, `flatMap()` 그리고 `filter()`등의 메서드를 동일하게 갖는다. Stream의 메서드들과 다른점이 있다면 각 메서드가 내부적으로 null 체크를 해준다는 것이다.

- `opt.map(Function<? super T, ? extends U> mapper)`

 담는 객체가 null이 아닌경우 함수형 인터페이스를 통해 작업을 수행한 후 리턴값을 Optional에 담아 반환한다. null인 경우 빈 Optional을 반환한다.

- `opt.flatMap(Function<? super T, Optional<U>> mapper)`

 `map()` 메서드와 비슷하지만 파라메터로 넘기는 함수형 인터페이스가 Optional 자체를 반환한다. 마찬가지로 담는 객체가 null인 경우 빈 Optional을 반환한다.

- `opt.filter(Predicate<? super T> predicate)`

 담고있는 객체가 함수형 인터페이스의 조건에 따라 `true`를 리턴하면 해당 Optional 객체를 반환하고, `false`를 리턴하거나 비어있는 경우 빈 Optional 객체를 반환한다.

 이렇게 내부적으로 null을 체크해주는 메서드를 사용하여 `getCiryFromLocation(Location location)`을 다시 구현하면 다음과 같이 깔끔하게 표현할 수 있다.

```java
public String getCiryFromLocation(Location location) {
    return Optional.ofNullable(location)
                   .map(Location::getContinent)
                   .map(Continent::getCountry)
                   .map(Country::getCity)
                   .orElse("Seoul");
}
```

 기존에 null 체크를 위한 조건문들을 Optional이 제공하는 메서드 내부에서 처리 되도록 하여 코드상에서 null에 대한 표현이 없으면서도 메서드 체이닝을 통해, 과장한다면 단 한 줄로 간결하게 표현할 수 있다.

### 반환하지 않는 Optional

 위에서 가정한 상황들은 모두 Optional이 담고있는 객체를 반환하여 직접적으로 접근하여 사용하는 경우이다. 만약 담고있는 객체가 null이 아닌 경우 특정 로직이 수행되도록 하고 싶다면 다음과 같이 구현해야한다.

```java
if (optLocation.isPresent()) {
    Location location = optLocation.get();
    // Logic
}
```

 이러한 조건문을 사용하지 않기 위해 앞서 설명한 것 처럼 `map()` 또는 `filter()` 통해 표현하면 다음처럼 구현할 수 있다.

```java
// map() 
optLocation.map(location -> {
    // Logic
    return location;
});

// filter()
optLocation.filter(location -> {
    // Logic
    return true;
});
```

 위의 두가지 방법 모두 Optional이 담고있는 객체가 null이 아닌경우 로직을 수행한다. 하지만 두 방법 모두 불필요한 결과값을 리턴한다는 것이 어색하다. 거기에 `map()`의 경우 내부 구현을 보면 리턴하는 값을 `Optional.ofNullabe()`를 통해 Optional 인스턴스를 생성하기 때문에 map을 사용하여 위와같은 표현을 남발할 경우 쓸데없는 인스턴스를 계속해서 생성한다. 이러한 경우를 위해 Optinal에선 `ifPresent()`라는 메서드를 제공한다.

- `opt.ifPresent(Comsumer<? super T> comsumer)`

 담고있는 객체가 null이 아닌 경우 파라메터로 전달하는 함수형 인터페이스가 수행된다. 한가지 주의할 점은 전달하는 파라메터가 null인 경우 NPE를 발생시킨다는 것이다.

  `ifPresent()`를 사용해서 Optional이 담는 객체가 null이 아닐 때 특정 로직이 수행되게 하면 다음과 같이 표현할 수 있다.

```java
optLocation.ifPresent(location -> {
    // Logic
});
```

 앞서 작성한 코드보다 엄청나게 개선되었다고 할 수는 없지만, 불필요한 리턴이 없고 메서드 이름부터 표현하는 바가 확실하다.

# 마무리

 Optional은 NPE에 대한 안정성을 확보하면서도 보다 깔끔한 코드를 작성할 수 있도록 도와준다. 문장으로 설명한 글이기 때문에 모든 상황에 대한 구현에 대해선 부족하다고 생각한다. Optional 내부 구현이 크게 어렵지 않기 때문에 직접 구현을 살펴보고 기능을 정확히 알고 사용한다면, null로 인한 스트레스로 부터 벗어날 수 있을 것이다.