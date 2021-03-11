안드로이드 플랫폼에서 개발을 하다보면 버튼 이벤트를 다루는 것 이외에 화면 터치를 이용한 처리를 해야할 때가 있습니다. 직접 화면에 터치된 손가락의 좌표를 구해오고 이를 통해 제어를 해야할 때 단순히 하나의 손가락을 이용해 처리를 하는 경우도 있지만 좀 더 디테일하고 다양한 터치를 구현하기 위해선 하드웨어를 통해 받아온 터치 값들을 코드를 통해 다룰 수 있어야 합니다.

터치를 다루기 위해 알아야할 개념 2가지가 있습니다. 그 둘은 포인터 아이디와 포인터 인덱스입니다.

- **포인터 아이디** 터치가 발생했을 때 각각의 터치된 손가락들은 아이디 값을 가지게 됩니다. 그 터치된 순서에 따라 0부터 차례대로 아이디를 부여받으며 멀티터치에서 터치 좌표를 가져올 때 포인터 아이디가 사용됩니다. 
-   **포인터 인덱스** 포인터 인덱스는 터치 이벤트가 발생했을 때 터치된 손가락 수 만큼 0에서부터 시작해 1씩 증가하게 된다. 만약 손가락 3개가 터치되었다면 각각의 손가락들은, 포인터 인덱스 0에서 2까지가 됩니다. 

<포인터 아이디와 포인터 인덱스>

두 개념 모두 터치가 발생했을 때 터치된 손가락에게 0부터 숫자를 부여한 후 사용하기 때문에 같은 것 처럼 보이지만 조금 다른 개념을 갖고 있습니다.

 포인터 아이디의 경우 터치 되어있는 손가락을 트래킹(추적)하기 위해 사용됩니다. 때문에 한번 터치된 손가락이 떼어지지 않는 이상 처음 터치되었을 때와 같은 아이디를 유지합니다. 예를 들어 첫번째 손가락이 터치를 한후 0의 아이디값을 갖고, 두번째 손가락이 터치를 해 1의 아이디를 부여 받습니다. 이때 첫번째 손가락이 떼어지더라도 터치 상태를 유지하고 있는 두번재 손가락의 아이디는 1을 유지합니다.

 하지만 포인터 인덱스의 경우에 위와 같은 상황이 발생한다면, 첫번째와 두번째 손가락이 터치를 하여 인덱스 0이 아이디 0(첫번째 손가락)을 가리키고 인덱스 1이 아이디 1(두번째 손가락)을 가리키던 중 아이디 0(첫번째 손가락)이 화면에서 떨어지면, 바뀌지 않던 두번째 손가락의 아이디와는 다르게, 두번째 손가락을 가리키던 인덱스는 1에서 0으로 바뀌게 됩니다. 인덱스는 포인터 아이디를 효율적으로 관리하기 위해 사용되기 때문입니다.

 그렇다면 만약 위의 상황 이후 다시 다른 손가락이 화면을 터치한다면 어떻게 될까요? 새로 터치된 손가락은 아이디 0을 부여 받고, 이 아이디 0을 가리키는 인덱스는 1이 됩니다. 아이디는 0부터 순차적으로 매겨지지만, 앞의 숫자가 비어있는 경우 그 숫자를 먼저 부여합니다.

 인덱스는 이와 달리 아이디들이 생성되거나 소멸될 때마다 0에서부터 차례대로 정렬이 되므로 그 이후의 값을 부여합니다. 즉, 포인터 인덱스는 현재 터치되어있는 아이디들(손가락들)의 터치 순서에 맞춰 0부터 순서대로 아이디값을 가리킵니다.

 위의 개념은 멀티터치를 구현하는데 중요하게 사용됩니다. 만약에 인덱스나 포인터 값을 잘못 사용하면 사용한 인덱스(index) 값이 범위(range)를 벗어나 심각한 오류(error)를 발생시킬수 있습니다. 때문에 멀티터치를 사용한 입력을 만들기 전 위의 개념에 대해 확실히 알고 넘어가는 것이 중요합니다.

# 싱글터치

 싱글터치의 경우 간단히 구현이 가능합니다. 왜냐하면 인덱스를 사용할 필요도 없이 터치된 값들을 이용해서 구현하면 되기 때문에 터치 정보들을 인덱스 값 지정 없이 받아서 사용하면 됩니다.

```java
public float x, y;
@Override
public boolean onTouchEvent(MotionEvent event) {
    x = event.getX();
    y = event.getY();
    return super.onTouchEvent(event);
}
```

 간단하게 싱글터치를 구현한 예제 함수 코드입니다. 위의 코드와 같은 구조를 이용하면 간단한 싱글터치 이벤트 처리를 할 수 있습니다. 하지만 입력값은 단순히 터치가 된 값만을 처리하진 않습니다. 터치가 눌러졌을 때, 움직였을 때, 띄어졌을 때의 터치 좌표를 알아야 더 정확한 입력 처리를 할 수 있습니다. 안드로이드에선 이를 위해 MotionEvent를 지원합니다.

```java
public float x, y;
@Override
public boolean onTouchEvent(MotionEvent event) {
    final int action = event.getAction();
    switch(action) {
        case MotionEvent.ACTION_DOWN:
            // 처음 터치가 눌러졌을 때
            x = event.getX();
            y = event.getY();
            break;
        case MotionEvent.ACTION_MOVE:
            // 터치가 눌린 상태에서 움직일 때 
            x = event.getX();
            y = event.getY();
            break;
        case MotionEvent.ACTION_UP:
            // 터치가 떼어졌을 때
            x = event.getX();
            y = event.getY();
            break;
        default :
            break;
    }
    return true;
}
```

 싱글터치이기 때문에 getX()와 getY() 함수를 이용하여 터치 좌표를 받아올 때 다른 인자(parameter)를 넘겨주지 않고 사용합니다. 인덱스 값을 넘겨주지 않으면 포인터 인덱스의 값을 할당 받은 포인터 아이디 중 인덱스가 0인 값, 즉, 지금 터치가 되어있는 손가락(포인터)들 중 가장 먼저 터치가 된 손가락(포인터)의 터치 좌표를 사용합니다.

# 멀티터치

 멀티터치의 경우 싱글터치보다 약간 복잡한 모습을 보여줍니다. 위에서 언급했던 포인터 아이디와 인덱스 모두를 고려하여 구현을 해야하기 때문에 약간의 주의가 필요합니다. 잘못 접근을 했다간 에러가 발생하기 때문입니다.

 때문에 터치 포인터에 관련된 아이디와 인덱스, 이 둘을 안전하게 사용하기 위해 다음의 함수들를 사용할 수 있습니다.

`MotionEvent.getPointerCount()` : 현재 터치된 손가락(아이디)의 갯수를 리턴하는 메소드

`MotionEvent.getPointerId(index)` : 인덱스를 이용해 아이디를 리턴하는 메소드

`MotionEvent.getPointerIndex(id)` : 아이디를 이용해 인데스를 리턴하는 메소드

 특정 포인터의 값을 받아와 처리해야하기 때문에 위의 함수들을 이용해서 원하는 터치값을 이용해서 멀티터치 처리를 할 수 있습니다. 함수이외에도 멀티터치를 구현하기 위해 신경써주셔야 하는 부분이 있습니다. 싱글터치에서 사용된 MotionEvent.ACTION_DOWN과 MotionEvent.ACTION_UP은 인덱스의 크기가 1일 때(터치된 손가락이 하나일 때)만 사용되기 때문에, 추가적으로 인덱스 크기가 1 이상일 때 터치 값을 처리할 수 있도록 추가적인 케이스를 추가해야 합니다. 구현을 통해 세부적인 설명을 하도록 하겠습니다.

```java
@Override
public boolean onTouchEvent(MotionEvent event) {
    final int action = event.getAction();
    switch(action & MotionEvent.ACTION_MASK) {
        case MotionEvent.ACTION_DOWN:
            // 처음 터치가 눌러졌을 때
            break;
        case MotionEvent.ACTION_MOVE:
            // 터치가 눌린 상태에서 움직일 때
            break;
        case MotionEvent.ACTION_UP:
            // 터치가 떼어졌을 때
            break;
        case MotionEvent.ACTION_POINTER_DOWN:
            // 터치가 두 개 이상일 때 눌러졌을 때
            break;
        case MotionEvent.ACTION_POINTER_UP:
            // 터치가 두 개 이상일 때 떼어졌을 때
            break;
        default :
            break;
    }
    return true;
}
```

 먼저 switch의 조건문에 들어가는 인자는 기존의 action 대신 action & MotionEvent.ACTION_MASK가 들어간걸 볼 수 있습니다. MotionEvent.ACTION_MASK는 발생한 터치 이벤트의 액션을 구분하기 위해 사용되는 마스크입니다. 또한 switch case에 MotionEvent.ACTION_POINTER_DOWN과 MotionEvent.ACTION_POINTER_UP이 추가되어 인덱스의 크기가 1 이상일 때도 터치값을 받아와 사용할 수 있게 되었습니다. 이때 인덱스 값을 이용해 어떤 인덱스의 손가락(포인터)가 추가적으로 눌러졌거나 떼어졌는지 확인해야 합니다.

 터치가 추가적으로 발생하는 경우 인덱스는 무조건 증가하기 때문에 마지막 인덱스를 이용하여 터치값을 사용하면 됩니다. 하지만 터치가 되고 있던 손가락이 스크린에서 떼어지는 경우, 터치가 된 순서대로 손가락이 떼어지진 않기 때문에 어떤 인덱스의 손가락(포인터)가 화면에서 떼어졌는지 알아내야 합니다.

```java
final int pointerIndex = (action & MotionEvent.ACTION_POINTER_INDEX_MASK) >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
```

 위의 코드를 통해 현재 활성화 된, 즉 두 개 이상의 손가락(포인터)가 화면에 터치되어있는 상황에서 MotionEvent.ACTION_POINTER_DOWN이나 MotionEvent.ACTION_POINTER_UP의 case에서 그 switch case를 발생시킨 손가락(포인터)의 인덱스를 구할 수 있습니다.

```java
private float x, y;
@Override
public boolean onTouchEvent(MotionEvent event) {
    final int action = event.getAction();
    switch(action & MotionEvent.ACTION_MASK) {
        case MotionEvent.ACTION_DOWN:
            // 처음 터치가 눌러졌을 때
            break;
        case MotionEvent.ACTION_MOVE:
            // 터치가 눌린 상태에서 움직일 때
            break;
        case MotionEvent.ACTION_UP:
            // 터치가 떼어졌을 때
            break;
        case MotionEvent.ACTION_POINTER_DOWN:
            // 터치가 두 개 이상일 때 눌러졌을 때
            final int pointerIndex = (action & MotionEvent.ACTION_POINTER_INDEX_MASK) >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
            x = getX(pointerIndex);
            y = getY(pointerIndex);
            break;
        case MotionEvent.ACTION_POINTER_UP:
            // 터치가 두 개 이상일 때 떼어졌을 때
            final int pointerIndex = (action & MotionEvent.ACTION_POINTER_INDEX_MASK) >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
            break;
        default :
            break;
    }
    return true;
}
```

ㄴ 위의 코드를 사용하여 터치가 여러개 되었을 때, 새로 터치된 각각의 터치에 대한 처리를 포인터 아이디를 통해 처리할 수 있습니다. 멀치터치를 이용하면 여러 제스처를 처리하기위해선 단순히 터치값을 받아서 사용하는 것 뿐만 아니라, 더 다양한 방법을 사용해 여러가지 기능을 구현할 수 있습니다. 