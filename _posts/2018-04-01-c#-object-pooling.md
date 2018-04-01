---
title: 오브젝트 풀링
date: 2018-04-01
categories:
- Unity
tags:
- Development
- Unity
- C#
---



# 오브젝트 풀링

 C#과 같이 GC[^GC]를 사용하는 프로그래밍 언어에선 메모리 해제에 대해 신경을 안써도 된다는 점은 프로그래머의 입장에선 편리하게 다가온다. 하지만 메모리의 해제에 대한 역할을 프로그래머 대신 GC가 대신 수행하기 때문에 발생하는 문제가 있다. 바로 GC가 일어나는 타이밍이나 점유 시간을 알지 못한다는 것이다.

[^GC]: GC(Garbage Collection) : 더이상 참조되지 않는 메모리 영역을 자동으로 탐지하여 해제하는 기법.

 하지만 그럼에도 많은 오브젝트들을 만들어 사용해야하는 경우에는 어쩔 수 없이 오브젝트를 생성해야 한다. 이때, 다 사용한 오브젝트를 그냥 GC를 통해 메모리를 반환하지 않고 풀을 통해 관리하면서 다음에 사용될 때 재사용을 할 수 있다면, 메모리 할당에 들어가는 공수를 줄이고, GC가 불리더라도 해제 되는 메모리의 크기를 줄여 GC가 점유하는 시간을 줄일 수 있다.

![object pooling](https://user-images.githubusercontent.com/18159012/38173328-950fd4b0-35f7-11e8-8ac0-f8a143f12887.png)

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
    
	private readonly CreateElement createMethod;
	private readonly Action<T> onGet;
	private readonly Action<T> onPut;
	
	public ObjectPool(CreateElement createMethod, Action<T> onGet = null, Action<T> onPut = null)
    {
    	this.createMethod = createMethod;
    	this.onGet = onGet;
    	this.onPut = onPut;
    }
    
    public T Get()
    {
    	T element;
    	if (stack.Count == 0) 
        {
        	element = createMethod.Invoke();
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

