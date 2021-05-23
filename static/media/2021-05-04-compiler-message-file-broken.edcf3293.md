<!-- https://reiphiel.tistory.com/entry/anonymous-class-instantiate-error-type-inference -->
<!-- https://www.python2.net/questions-580980.htm -->

![jdk-version](https://img.shields.io/badge/JDK-11-red.svg?style=flat-square)  

```terminal
> Task :compileJava
...
compiler message file broken: key=compiler.misc.msg.bug arguments=11.0.2, {1}, {2}, {3}, {4}, {5}, {6}, {7}
java.lang.NullPointerException
	at jdk.compiler/com.sun.tools.javac.comp.Flow$FlowAnalyzer.visitApply(Flow.java:1235)
	at jdk.compiler/com.sun.tools.javac.tree.JCTree$JCMethodInvocation.accept(JCTree.java:1634)
	at jdk.compiler/com.sun.tools.javac.tree.TreeScanner.scan(TreeScanner.java:49)
	at jdk.compiler/com.sun.tools.javac.comp.Flow$BaseAnalyzer.scan(Flow.java:398)
	at jdk.compiler/com.sun.tools.javac.tree.TreeScanner.visitSelect(TreeScanner.java:302)
    ...

> Task :compileJava FAILED
```

위와 같은 에러가 배포도중 발생했는데, JDK 11에서 에러 메세지를 출력하기 위해 메세지를 처리하다가 NPE가 발생한 문제이고, 해당 문제는 JDK 8 또는 12에선 발생하지 않는다. 실제로 제대로 출력되었어야할 메세지는 다음과 같았다.

```terminal
cannot infer type arguments for org.springframework.core.ParameterizedTypeReference

reason: cannot use '<>' with anonymous inner classes
```

실제로 `ParameterizedTypeReference`를 사용하는 부분중 타입을 지정하지 않고 사용하는 부분이 있었고, 해당 부분을 수정 후에는 위의 문제가 발생하지 않았다.

```java
new ParameterizedTypeReference<>() {}
```

to

```java
new ParameterizedTypeReference<Object>() {}
```