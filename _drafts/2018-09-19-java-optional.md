---
title: 자바 Optional
date: 2018-09-18
categories:
- Development
tags:
- Development
- Java
---

 

자바를 사용해서 개발을 할 때 개발자들이 가장 흔하게 겪는 예외는 NPE<sup>Null Pointer Exception</sup>일 것이다. NPE는 컴파일 타임에서 확인 할 수 없어, 조심하지 않으면 갑자기 런타임에 등장한 NPE에 속수무책으로 당할 수 밖에 없다. null의 개념을 처음으로 고안한 영국의 컴퓨터 과학자인 Tony Hoare도 나중에 자신의 생각이 10억불 짜리 큰 실수[^1]였고,  null 참조를 만든 것을 후회한다고 했다.

[^1]: https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare 

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

 자바에 익숙한 개발자라면 NPE 위험에 얼마나 많이 노출되어있는지 알 수 있다. 위의 코드를 NPE 발생을 회피하기 위해서 다음과 같이 수정할 수 있다.

## null 방어 코드

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

 null 체크할 때마다 기본값을 리턴하며 중첩을 피할 수 있지만 기본값을 리턴하는 문장이 반복되어 유지보수가 어렵다. 

 두가지 방법 모두 객체의 메서드나 필드에 접근하기 전에 null 체크를 하여 NPE를 방지하고 있다. 하지만 NPE 방어를 하지 않는 처음의 메서드보다 코드가 상당히 지저분한 것을 볼 수 있다.

# Java8과 Optional

 함수형 언어에선 존재할지 안할지 모르는 값을 나타내는 별도의 타입을 갖는다. 자바8에선 함수형 언어에서 영감을 받은 여러 기능들이 추가되면서 함수형 언어가 null을 대하는 접근 방식에서 영감을 받은 `java.util.Optional<T>`라는 새로운 클래스가 추가되었다.

## Optional이란?

Optional은 Nullable한 객체를 담을 수 있는 Container 오브젝트이다. 때문에 NPE를 유발할 수 있는 null 레퍼런스를 직접 다루지 않고 이를 Optional에게 위임할 수 있다. 또한 명시적으로 해당 객체가 null일 수 있다는 가능성을 표현할 수 있기 때문에 불필요한 NPE 방어 로직을 줄일 수 있다.

## Optional의 사용

 -변수 선언

Optional은 제네릭을 제공하기 때문에 변수를 선언할 때 명시한 타입에 따라 담을 수 있는 객체의 타입이 결정된다.

```java
Optional<Location> location;
Optional<Continent> optContinent;
Optional<Country> maybeCountry;
```

~~변수를 선언할 때 'opt' 또는 'maybe' 접두사를 붙이기도 한다.~~

-객체 생성

Optional 객체는 클래스에서 제공하는 3가지 정적 팩토리 메서드를 통해 생성할 수 있다.

`Optional.empty()`

`Optional.of(value)`

`Optional.ofNullable(value)`

-객체의 접근

`opt.get()`

`opt.orElse(T other)`

`opt.orElseGet(Supplier<? extends T> other)`

`opt.orElseThrow(Supplier<? extends X> exceptionSupplier)`

-잘못된 사용

`opt.isPresent()`

-컨테이너로 사용하기

`opt.map()`

`opt.flatMap()`

`opt.filter()`

-특별한 상황

`opt.ifPresent(Comsumer<? super T> comsumer)`

