---

---

최근에 많은 주목을 받고 있는 액터 모델(Actor model)의 개념 자체는 새로운 것이 아니다. 무려 40년 전인 1973년에 칼 휴이트라는 사람이 제안했던 개념이다. 휴이트의 개념은 얼랭(Erlang)이라는 언어로 구체화되었고 스웨덴 통신회사인 에릭슨(Ericsson)에서 고도의 동시성 프로그램을 구현할 때 실제로 사용되었다.

액터는 ‘쓰레드’ 혹은 ‘객체’와 구별되는 추상이다. 액터가 차지하는 메모리 공간은 어느 다른 쓰레드 혹은 액터가 접근할 수 없다. 다시 말해서 액터 내부에서 일어나는 일은 어느 누구와도 ‘공유’되지 않는다. 앞서 언급한 죽음의 칵테일에서 ‘공유’라는 속성을 제거함으로써 멀티쓰레드와 관련된 문제의 대부분을 제거했다.

공유되지 않기 때문에 액터 내부에서 작업을 수행할 때는 ‘lock’이나 ‘synchronized’와 같은 부자연스러운 키워드가 필요 없다. 그래서 액터 모델에서는 잠금장치나 쓰레드라는 개념이 눈에 보이지 않는 어디론가 사라진다.

액터 모델을 구현한 라이브러리 중에서 대표적인 것은 아카(Akka)다.

타입세이프(Typesafe)라는 회사에서 제공하는 아카 라이브러리는 액터를 활용한 고도의 동시성 코드를 작성하는 것을 가능하게 해준다.

아카 라이브러리를 이용해서 확장가능(scalable)한 병렬처리 시스템을 성공적으로 구축했다.

**Actor Model** 

다루어야 하는 데이터의 양이 많아지고 이들 데이터를 처리해야 하는 수치모델이 복잡해 짐에 따라서,

단일의 컴퓨터와 단일의 프로세스만으로는 원하는 시간내에 정보를 얻기가 힘들어지고 있다. 요구되는 정보의 질이 컴퓨터 자체의 능력을 뛰어넘은 결과라고 볼 수 있을 것 같다.

이러한 문제를 해결하기 위해서, 분산/병렬 컴퓨팅환경을 구축한다거나 멀티프로세스/멀티쓰레딩 기술이 사용되게 된다.

이러한 분산/병렬 프로그래밍에서는 동시성제어가 중요한 문제로 떠오르게 된다.

actor model은 동시성문제를 해결하기 위해 제시한 여러가지 방법 중 하나이다.

Actor model은 기본단위를 actor로 한다.

각 actor들은 마치 무대의 actor들이 서로 대사를 주고 받는 것 처럼 서로 message를 주고 받는 것으로 주어진 일을 동시에 수행한다.

최소단위인 actor들은 단지 메시지만을 주고 받기 때문에, 경쟁조건 혹은 데드락(deadlocK)와 같은 문제를 고민하지 않고 문제를 풀어나갈 수 있다.

경쟁조건과 데드락을 부르는 공유되는 자원이 없기 때문이다.

**Actor model 을 사용하는 이유**

이렇게 오래된 개념이 요새와서 다시 각광을 받는 이유는 multi processing에 적합한 개념이기 때문이다.

더 이상 moore’s law가 적용되지 않기 때문에 CPU vendor들은 하나의 CPU에 여러개의 프로세스를 장착하여 연산속도를 증가시키기 시작했다.

multi-core환경을 효율적으로 사용하려면 여러개의 thread를 이용하여 구현하는 것이 중요하다.

하지만 shared resource를 가지는 멀티쓰레드 환경에서는 여러가지 문제들(race condition, deadlock, blocking call 등)이 발생하기 쉽기 때문에 이를 회피하기 위한 패턴 혹은 모델들이 여러가지 나오게 되었고, 그 과정에서 actor model이 다시 각광받기 시작하였다.

**Actor model** **기본 개념** 

Actor model은 모두가 actor이라는 철학을 바탕으로 하고 있다. 모든게 객체다 라는 OOP와 비슷하다고 볼 수 있겠다.

그러나 OOP가 순차적인 반면, Actor model은 근본적으로 ‘동시적이라는 차이점을 가진다.

actor model은 다음과 같이 message를 주고 받음으로써 동시성을 달성한다.

\1. 즉 다른 배우에게 몇개의 메시지를 보내면

\2. 몇개의 배우가 생성이 된다.

\3. 메시지에는 메시지를 받은 배우가 처리해야할 내용이 담겨져 있다.

각 배우들간의 통신은 비동기적으로 이루어지며, 메시지를 전부받기 위해서 기다릴 필요도 없다.

메시지를 원하는 배우에게 보내기 위해서, 우편시스템을 사용한다. 즉 메시지는 배달되어야될 배우의 주소를 가진다. 이를 mail address라고 한다.

그러므로 배우는 자신의 주소로 배달된 메시들을 가지고 통신을 할 수 있게 된다.

**Actor model 특징**

actor model은 간단히 설명하면 behavior, state, mailbox로 구성된 actor를 기본 단위로 하는 message processing을 이용하여
behavior를 비동기적으로 실행하는 model이다.

이때 기본단위가 되는 actor는 몇 가지 특징이 있다.

우선 각 actor는 서로 간에 공유하는 자원이 없고 서로간의 state를 건드릴 수 없고, 오로지 message를 이용해서만 간섭할 수 있다.
message는 mailbox에 쌓였다가 들어온 순서대로 처리된다.
실행되는 behavior는 message에 의해 결정되고, 할 수 있는 일은 자신의 state를 바꾸거나,

child actor를 만들거나, child actor를 죽이거나 다른 actor에 message를 보낼 수 있다.

(actor model의 actor는 사실 OOP에서 말하는 object와 매우 비슷하다는 걸 상기 시켜라.)

object는 member variable(state)을 가지고 있고, 어떤 방식으로 동작할지 method(behavior)를 가지고 있다.
method는 다른 object를 만들거나, 자기가 관리하는 object를 부수거나 다른 object의 method를 호출하는 일을 한다.
현대의 OOP 언어들(Java, C#, c++ 등)만을 사용한 사람들은 message를 이용해 method를 호출한다는 개념이 익숙하지 않을 수 있다.
하지만 과거의 pure한 OOP 언어들(Simula, Smalltalk)에서는 다른 object에 message를 보내면 받은 message에 해당하는

method를 부른다는 개념이 있고, 이것이 간략화되어 object의 method를 호출한다는 개념이 된 것이다.
그렇다면 OOP의 object 와 actor model의 actor는 어떤 차이가 있을까?

그 차이는 단 한 가지이다.

Object의 method는 message를 보낸 context에서 바로 실행되어 method가 끝날 때까지 기다리지만,

actor model의 actor는 message를 보낸 context 와 독립적인 context에서 비동기적으로 실행된다는 것이다.

 **Actor model의 장점과 단점**

Actor model의 가장 큰 장점은 이해하기 쉽다는 것이다.

message를 받으면 그에 맞는 behavior를 실행한다는 매우 간단한 동작원리와 다른 것에 영향을 받지 않는다는

특징 때문에 실행 순서를 이해하고 결과를 예측하기 매우 쉽다. 또한, 모든 간섭을 message를 통해서 한다는 것도 큰 장점이다.

우선 shared resource가 존재하지 않기 때문에 shared resource들로 말미암아서 생기던 문제들(race condition, deadlock 등)이 발생하지 않는다.

그리고 message가 serializable하기만 한다면 같은 서버에서 실행하던 Actor를 다른 서버에서 실행하여 message를 주고받는 것도 가능하므로

손쉽게 서버를 scale-out할 수 있다.

물론 actor model이 장점만 가지는 것은 아니다.

shared state를 가지지 않고 모든 통신을 message로 하는 것은 control flow를 제어하고

correctness를 보장하는 것에는 큰 장점이었지만 속도 면에서는 큰 단점이 된다.

그렇다면 scala의 구현체인 akka는 어떻게 actor를 사용할지 코드를 통해서 알아보도록 하자.

#### Concurrency in akka

import akka.actor.Actor

case object Greet

case class WhoToGreet(who: String)

case class Greeting(message: String)

class Greeter extends Actor {

var greeting = “default”

def receive = {

case WhoToGreet(who) => greeting = s”hello, $who”

case Greet => sender ! Greeting(greeting) // Send the current greeting back to the sender

}

}*** 참고 소스->> <https://gist.github.com/sgkim126/10131492#file-greeter-scala>

 Actor 를 상속받아 receive method만 구현하면 Actor로 사용할 수 있다.

 receive method Any타입을 받을 수 있기 때문에 보통 패턴매칭을 이용하여 구현한다.

 Actor에 메세지를 보내는 방법은 크게 3가지가 있다.

import akka.actor.{ ActorRef, ActorSystem, Props, Inbox }

import scala.concurrent.duration._

case class WhoToGreet(who: String)

case class Greet

object OneWayActorExample extends App {

val system = ActorSystem(“actorexample”)

val greeter = system.actorOf(Props[Greeter], “greeter”)

greeter.tell(WhoToGreet(“akka”), ActorRef.noSender)

greeter.tell(Greet, ActorRef.noSender)

 

https://gist.github.com/sgkim126/10139719#file-onewayactorexample-scala

 

import akka.actor.{ ActorRef, ActorSystem, Props, Inbox }

import scala.concurrent.duration._

case class WhoToGreet(who: String)

object SynchronousActorExample extends App {

val system = ActorSystem(“actorexample”)

val greeter = system.actorOf(Props[Greeter], “greeter”)

val inbox = Inbox.create(system)

greeter.tell(WhoToGreet(“akka”), ActorRef.noSender)

inbox.send(greeter, Greet)

val Greeting(message1) = inbox.receive(5.seconds)

println(s”Greeting: $message1″)

}*** 참고소스 [https://gist.github.com/sgkim126/10142974#file-synchronousactorexample-scala](https://www.facebook.com/l.php?u=https%3A%2F%2Fgist.github.com%2Fsgkim126%2F10142974%23file-synchronousactorexample-scala&h=_AQEBrM15&s=1)

Inbox를 이용하여 message를 보내면 recevie method를 통해서 Actor가 message를 처리하고 응답을 보내기를 기다린다. timeout시간을 주기는 하지만 이렇게 하면 결국 서로 다른 2개의 Actor에서 서로를 기다리면서 deadlock이 생길 수 있다.
그렇기 때문에 akka에서는 Actor안에서는 Inbox를 이용하여 synchronous하게 메세지 보내는 것을 추천하지 않는다.그래서 대부분의 통신은 3번째 방법을 사용한다.

import akka.actor.{ ActorRef, ActorSystem, Props }

import akka.pattern.ask

import scala.concurrent.duration._

case class WhoToGreet(who: String)

object ASynchronousActorExample extends App {

val system = ActorSystem(“actorexample”)

val greeter = system.actorOf(Props[Greeter], “greeter”)

greeter.tell(WhoToGreet(“akka”), ActorRef.noSender)

val future = ask(greeter, Greet(“typesafe”))(5.seconds)

future.onSuccess {

case Greeting(message: String) => println(s”Greeting: $message1″)

}

}*** 참고 소스->> <https://gist.github.com/sgkim126/10143232#file-asynchronousactorexample-scala>

위의 방법은 ask 함수를 이용하여 Future객체를 만들고 callback을 등록하여 asynchronous하게 처리할 수 있게 해준다.

이 외에도 akka의 중요한 특징으로 concurrency외에 scalability와 fault-tolerance를 들 수 있다.
akka는 serializable 메시지들만을 이용하였다면, 물리적으로 다른 서버에 있는 actor와 메시지를 주고받을 수 있게 해준다. 이를 이용해서 scale-out을 쉽게 구현할 수 있게 해준다.
또한, child actor를 만들어서 메시지를 주고 모니터링할 수 있는 시스템을 제공해주기 때문에 손쉽게 오류에서 복구할 수 있도록 해준다.*** 위의 코드는 activator에 들어 있는 hello-akka tutorial을 기반으로 작성되었다.



출처: [Actor Model에 관하여](https://pegasuskim.wordpress.com/2015/12/23/actor-model-%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC/)