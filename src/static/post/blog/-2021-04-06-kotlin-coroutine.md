# Process vs Thread vs Routine
## Process
Heap + N * Thread (stack)

## Thread
Share heap memory  
context switching on kernel  
Cache refresh  
run many routines  

## Coroutine
Co + routine  
main routine, sub routine  
lightweight thread  

# Coroutine in Kotlin
- CoroutineContext
- CoroutineScope
  - GlobalScope
- CoroutineDispatcher
  - Default
    - CPU X 2개의 thread
  - IO
    - 64 + Default pool
  - Unconfined
    - No guaranteed order
  - Main
    - Android에서 사용됨, BE에서 사용하려고 하면 exception
- CoroutineStart
  - DEFAULT
  - LAZY
  - ATOMIC
  - UNDISPATCHED

# How to run
## before compilation
```kotlin
suspend fun plusOne(initial: Int) : Int {
 val one = 1
 var result = initial
 result += one
 return result
}
```

코루틴으로 동작하는 코드를 만들기 위해선 크게 다른 작업을 해야할 것 없이 기존에 코드를 만들던 것 처럼 작성을 해주면 된다. 하지만 `suspend`가 메서드 선언 앞에 붙게 되는데, 해당 키워드를 통해서 작성된 메서드는 코루틴 혹은 다른 suspend 메서드에서만 호출될 수 있다.

`suspend` 키워드가 사실 코루틴의 거의 전부라고 봐도 되는데, 해당 키워드를 통해서 메서드는 일시정지와 재개가 가능해진다.

## after compilation
```kotlin
fun plusOne(initial: Int, countinuation: Countination) : Int {
 val state = continuation as empty ?: CoroutineImpl {…}
 switch(state.label) {
   case 0:
     state.label = 1
     val one = 1
     sm.one = one …
   case 1:
     val one = sm.one
     var result = initial
   case 2:
     result += one
   case 3:
     return result
  }
}
```

컴파일 이후의 코드를 보면 `Countination` 타입의 파라메터가 기존 메서드에 추가되었다. 해당 클래스는 state를 저장하고 하나의 메서드의 로직을 여러 단계로 나눴을때 순차적으로 동작하도록 도와준다.

순차적으로 동작하기 위해서 각 코드 라인당 하나의 switch case로 만들어 0부터 하나씩 증가하면서 코루틴에서 한번씩 동작을 하도록 하게 되어있다.

> `Countination` 클래스의 코틀린 파일
> ``` kotlin
> /**
>  * Interface representing a continuation after a suspension point that returns a value of type `T`.
>  */
> @SinceKotlin("1.3")
> public interface Continuation<in T> {
>     /**
>      * The context of the coroutine that corresponds to this continuation.
>      */
>     public val context: CoroutineContext
>  
>     /**
>      * Resumes the execution of the corresponding coroutine passing a successful or failed [result] as the
>      * return value of the last suspension point.
>      */
>     public fun resumeWith(result: Result<T>)
> }
> ```

# Example
## Basic
```kotlin
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
 
fun main() = runBlocking { // this: CoroutineScope
    launch {
        delay(1000L)
        println("Task from runBlocking")
    }
 
    coroutineScope { // Creates a coroutine scope
        launch {
            delay(500L)
            println("Task from nested launch")
        }
 
        delay(100L)
        println("Task from coroutine scope") // This line will be printed before the nested launch
    }
 
    println("Coroutine scope is over") // This line is not printed until the nested launch completes
}
```

# Various scope
```kotlin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
 
fun main() = otherScope()
 
private fun sameScope() {
    runBlocking {
        val coroutineScope = CoroutineScope(Dispatchers.Default)
        val launchedShort = coroutineScope.launch {
            repeat(10) {
                println("in short : $it")
                delay(1000)
            }
        }
 
        val launchedLong = coroutineScope.launch {
            repeat(5) {
                println("in long : $it")
                delay(10000)
            }
        }
 
        delay(3000)
        launchedLong.cancel("long launched job is stopped")
    }
}
 
private fun otherScope() {
    runBlocking {
        val launchedShort = launch(Dispatchers.Default) {
            repeat(10) {
                println("in short : $it")
                delay(1000)
            }
        }
 
        val launchedLong = launch(Dispatchers.IO) {
            repeat(5) {
                println("in long : $it")
                delay(10000)
            }
        }
 
        delay(3000)
        launchedLong.cancel("long launched job is stopped")
    }
}
```

# Launch vs Async
```kotlin
package test.kotlin.coroutine.launchasync
 
import kotlinx.coroutines.async
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
 
fun main() = exampleAsync()
 
private fun exampleLaunch() {
    runBlocking {
        val launch = launch {
            repeat(10) {
                println("in short : $it")
                delay(1000)
            }
        }
        launch.join()
    }
}
 
private fun exampleAsync() {
    runBlocking {
        val async = async {
            repeat(10) {
                println("in short : $it")
                delay(1000)
            }
            "finished"
        }
        println("got deferred message = ${async.await()}")
    }
}
```

# Conclusion
## Thread 대비 이점은?
context switching 횟수를 줄일 수 있습니다.
light weighted thread
Continuation을 이용해서 컴파일시 코드의 분기를 만들고 yield, resume하는 구조
특히 코틀린에서는 문법이 매우 쉽습니다.
기술적인 이유보다 이게 제일 중요한 이유가 아닐까
## Kotlin에서 동시성 처리를 위해서 coroutine을 사용하겠다 한다면?
- 먼저 Dispatcher를 선택하세요
  - CPU Intensive? Default
  - IO blocking? IO
- 선택한 Dispatcher로 CoroutineScope를 생성하세요
  - 거의 그럴일은 없는데, start시점도 최대한 늦추고 싶으면 CoroutineStart.LAZY 를 같이 넘겨주세요
- CoroutineScope.async() or launch() 로 suspend fun(or lambda)를 넣어주세요

---

suspend가 가장 중요하다. 이것 없으면 그냥 코드 짜는거랑 다를게 없음.

코루틴

https://tourspace.tistory.com/152  
https://stackoverflow.com/questions/47871868/what-does-the-suspend-function-mean-in-a-kotlin-coroutine