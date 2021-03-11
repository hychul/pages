MyBatis의 select 태그에서 사용되는 resultType 프로퍼티는 mapper 쿼리로 가져온 결과를 Java의 어떤 타입으로 변환하여 반환할지 지정하는 프로퍼티입니다. 일단적으로 `java.util.Map`과 같이 패키지를 포함하는 FQCN<sup>Fully Qualified Class Name</sup>을 지정하여 사용하게 됩니다. 하지만 자주 사용하는 타입에 대해선 예약된 별칭<sup>alias</sup>을 통해 변환할 타입을 지정할 수 있습니다. 

```java
"string"        String.class
"byte"          Byte.class
"long"          Long.class
"short"         Short.class
"int"           Integer.class
"integer"       Integer.class
"double"        Double.class
"float"         Float.class
"boolean"       Boolean.class
"byte[]"        Byte[].class
"long[]"        Long[].class
"short[]"       Short[].class
"int[]"         Integer[].class
"integer[]"     Integer[].class
"double[]"      Double[].class
"float[]"       Float[].class
"boolean[]"     Boolean[].class
"_byte"         byte.class
"_long"         long.class
"_short"        short.class
"_int"          int.class
"_integer"      int.class
"_double"       double.class
"_float"        float.class
"_boolean"      boolean.class
"_byte[]"       byte[].class
"_long[]"       long[].class
"_short[]"      short[].class
"_int[]"        int[].class
"_integer[]"    int[].class
"_double[]"     double[].class
"_float[]"      float[].class
"_boolean[]"    boolean[].class
"date"          Date.class
"decimal"       BigDecimal.class
"bigdecimal"    BigDecimal.class
"biginteger"    BigInteger.class
"object"        Object.class
"date[]"        Date[].class
"decimal[]"     BigDecimal[].class
"bigdecimal[]"  BigDecimal[].class
"biginteger[]"  BigInteger[].class
"object[]"      Object[].class
"map"           Map.class
"hashmap"       HashMap.class
"list"          List.class
"arraylist"     ArrayList.class
"collection"    Collection.class
"iterator"      Iterator.class
"ResultSet"     ResultSet.class
```

예약된 별칭은 `org.apache.ibatis.type.TypeAliasRegistry`에 지정되어있습니다.
