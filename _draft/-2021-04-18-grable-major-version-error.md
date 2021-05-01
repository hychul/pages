```
Gradle sync failed: Cause: startup failed:
    General error during semantic analysis: Unsupported class file major version 60
    java.lang.IllegalArgumentException: Unsupported class file major version 60
    at groovyjarjarasm.asm.ClassReader.<init>(ClassReader.java:196)
    at groovyjarjarasm.asm.ClassReader.<init>(ClassReader.java:177)
    at groovyjarjarasm.asm.ClassReader.<init>(ClassReader.java:163)
    at groovyjarjarasm.asm.ClassReader.<init>(ClassReader.java:284)
    at org.codehaus.groovy.ast.decompiled.AsmDecompiler.parseClass(AsmDecompiler.java:81)
    at org.codehaus.groovy.control.ClassNodeResolver.findDecompiled(ClassNodeResolver.java:251)
    at org.codehaus.groovy.control.ClassNodeResolver.tryAsLoaderClassOrScript(ClassNodeResolver.java:189)
    at org.codehaus.groovy.control.ClassNodeResolver.findClassNode(ClassNodeResolver.java:169)
    at org.codehaus.groovy.control.ClassNodeResolver.resolveName(ClassNodeResolver.java:125)
    at org.codehaus.groovy.ast.decompiled.AsmReferenceResolver.resolveClassNul... (show balloon)
```

Gradle JVM 버전이 적합하지 않아서 발생하는 문제이기 떄문에 IntelliJ의 Gradle JVM 버전을 수정하면 된다.

Preferences - Build, Execution, Deployment | Build Tools | Gradle 에서 해당 옵션을 확인 할 수 있다.

![스크린샷 2021-04-18 오후 2 50 02](https://user-images.githubusercontent.com/18159012/115136507-264d4b80-a05b-11eb-8247-3046853aae1d.png)

IntelliJ Gradle JVM : https://www.jetbrains.com/help/idea/gradle-jvm-selection.html#jvm_settings