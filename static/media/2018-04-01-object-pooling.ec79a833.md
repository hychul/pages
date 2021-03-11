C#과 같이 GC[^GC]를 사용하는 프로그래밍 언어에서 메모리 해제에 대해 신경을 안써도 된다는 점은 프로그래머의 입장에선 편리하게 다가옵니다. 하지만 메모리의 해제에 대한 역할을 프로그래머 대신 GC가 수행하기 때문에 발생하는 문제가 있습니다. 바로 GC가 일어나는 타이밍이나 점유 시간을 알지 못한다는 것입니다.

[^GC]: GC(Garbage Collection) : 더이상 참조되지 않는 메모리 영역을 자동으로 탐지하여 해제하는 기법.

 하지만 그럼에도 많은 오브젝트들을 한번에 사용해야하는 경우에는 어쩔 수 없이 오브젝트를 생성해야 합니다. 이때, 다 사용한 오브젝트를 그냥 GC를 통해 메모리를 반환하지 않고 풀을 통해 관리하면서 다음에 사용될 때 **재사용**을 할 수 있다면, 메모리 할당에 들어가는 시간과 리소스를 줄이고 GC가 불리더라도 해제 되는 메모리의 크기를 줄여 GC 메모리를 반환하기 위해 점유하는, stop the world 시간을 줄일 수 있습니다.

![object pooling](https://user-images.githubusercontent.com/18159012/38173328-950fd4b0-35f7-11e8-8ac0-f8a143f12887.png)

 보통 오브젝트를 만들어주는 팩토리를 인터페이스로 선언하고 이를 확장하는 콜백을 구현하여 새로운 오브젝트를 생성하는 방법을 사용할 수 있지만, C#의 delegate를 사용하여 인터페이스를 대체하여 간단하게 구현했습니다. 이렇게 구현한 ObjectPool 클래스를 사용할 때 주의할 것이 있습니다. GC를 사용하지 않고 명시적으로 메모리를 해제해주는 언어들과 같이 **오브젝트가 다 쓰여진 후 풀에 다시 등록해 프로그래머가 직접 메모리 관리를 해주어야 한다는 것입니다.**



```c#
using System;
using System.Collections.Generic;

public class ObjectPool<T> where T : class
{
    public delegate T CreateElement();
    
    public int CountAll { get; private set; }
    public int CountActive
    {
     	get
        {
            return CountAll - CountInactive;
        }
    }
    public int CountInactive
    {
        get
        {
            return stack.Count;
        }
    }
	
    private readonly Stack<T> stack = new Stack<T>();
    
    private readonly CreateElement factoryMethod;
    private readonly Action<T> onGet;
    private readonly Action<T> onPut;
	
    public ObjectPool(CreateElement factoryMethod, Action<T> onGet = null, Action<T> onPut = null)
    {
        this.factoryMethod = factoryMethod;
        this.onGet = onGet;
        this.onPut = onPut;
    }
    
    public T Get()
    {
    	T element;
    	if (stack.Count == 0) 
        {
            element = factoryMethod.Invoke();
            CountAll++;
        }
        else {
            element = stack.Pop();
        }
        
        onGet?.Invoke(element);
        
        return element;
    }
    
    public void Put(T element)
    {
    	onPut?.Invoke(element);
    	
    	stack.Push(element);
    }
}
```

