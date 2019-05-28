kotlin foreach with size
```kotlin
    var list = listOf("A", "B", "C", "D", "E", "F", "G")
    list.forEachIndexed { index, item -> 
        println(item + "${index}")
    }
```