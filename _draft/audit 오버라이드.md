```java
@Audited
@AuditOverride(forClass = Parent.class)
public class Child extends Parent {
    ...
}
```

https://stackoverflow.com/questions/48398880/how-to-audit-just-part-of-superclass-in-hibernate