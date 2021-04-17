콜백<sup>Callback</sup>은 일반적인 함수 호출의 개념의 반대라고 보시면 됩니다. 일반적인 함수 호출<sup>Call</sup>에서 호출 하는 함수, 호출자<sup>Caller</sup>와 호출을 당하는 함수, 피호출자<sup>Callee</sup>로 나눠져 호출자가 피호출자를 불러 함수의 기능을 수행하게 되죠. 하지만 콜백은 이름에서 예상할 수 있듯이 호출을 거꾸로<sup>Back</sup> 하는 것입니다. 피호출자가 호출자를 부르게 되죠.

 콜백은 보통 특정 조건에 대한 액션을 수행해야할 때 사용됩니다. 콜백을 사용하지 않는다면 해당 조건을 만족하는지 계속해서 확인하는 과정이 필요하지만 콜백을 사용하면 조건이 만족되었을 때 콜백 메서드를 호출하기 때문에 busy-wating 없이 효율적으로 기능을 수행할 수 있습니다.

![java-callback-implement-0](https://user-images.githubusercontent.com/18159012/49135152-40bae900-f329-11e8-9b38-4f786ea4c975.png)

**자바에서의 콜백**

 콜백은 특정 조건에 대한 액션을 수행해야할 때 사용되기 때문에 실행 가능한 코드를 의미하지만 자바에선 함수 포인터를 사용할 수 없기 때문에 인터페이스를 사용하여 콜백을 구현합니다.

```java
class Callee {
    
    interface Callback { // 인터페이스는 외부에 구현해도 상관 없습니다.
        void callbackMethod();
    }
    
    private boolean m_condition;
    private Callback m_callback;
    
    public Callee() {
        m_condition = false;
        m_callback = null;
    }
    
    public void setCallback(Callback callback) {
        this.m_callback = callback;
    }
    
    public void calleeMethod() {
        m_callback.callbackMethod();
    }
    
    ...
}

class Caller {
    
    private Callee callee;
    
    public Caller() {
        Callee.Callback callback = new Callee.Callback() {
            @Override
            public void callbackMethod() {
                // 이곳에 콜백 메서드에서 할일을 구현 (값 전달, 복사...)
            }
        callee.setCallback(callback);
        ...
    }
        
        public void callerMethod() {
            callee.calleeMethod(); // 조건이 맞는 경우 Caller의 콜백 메서드가 호출된다.
        }
    
    ...
}
```

 `Caller.callerMethod()` 를 통해 `Callee.calleeMethod()`를 호출했지만, `Caller`에서 등록한 콜백 메서드가 호출됩니다. 콜백을 사용하면 현재의 작업이나 상태 등을 체크하고 Caller에게 값을 전달하거나 기능을 수행할 수 있습니다. 일반적인 구현에서, 값을 넘겨주는 쪽이 아닌 보통 넘겨 받는 쪽이 받아올 수 있는 상황인지 물어보고 받아오는 것과 달리, 콜백에선 넘겨주는 쪽이 스스로 넘겨줄 수 있는지 확인 후 넘겨줄 수 있을 때 값을 전달해 주는 것이죠. 