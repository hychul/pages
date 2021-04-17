그래픽스 라이브러리들은 엔지니어가 랜더링을 편리하게 해주는 고마운 존재다. 하지만 일반적으로 랜더링을 위한 메서드 호출을 의미하는 드로우 콜은 줄이면 줄일 수록 좋다고 말한다. 많은 드로우 콜은 프레임 레이트에 치명적인 영향을 줄 수 있기 때문이다.

# 드로우 콜의 비용이 비싼가?

옛날 버전의 라이브러리의 경우 컨텍스트 스위칭이 많이 필요했지만 실제 최근 그래픽 라이브러리의 드로우 콜의 비용은 그렇게 크지않다. GPU가 직접 폴리곤을 변환하고 랜더링할 수 있기 때문이다.

하지만 CPU가 한번의 드로우 콜마다 적은 수의 폴리곤을 GPU에게 넘겨 주게 된다면 GPU의 처리속도를 CPU가 따라가지 못해 CPU 바운드가 발생한다. 실제로 드로우 콜을 위한 버텍스 설정이나 쉐이더 설정과 같은 비용이 들긴 하지만 성능에 영향을 주는 가장 큰 요소는 CPU 바운드이다.

그렇다면 이러한 CPU 바운드를 해결하기 위한 방법은 무엇일까? 바로 한번에 많은 폴리곤 데이터를 GPU에게 넘겨주는 것이다. 앞서 CPU 바운드가 나타나는 원인은 GPU의 랜더링 처리의 비용은 그렇게 크지 않기 때문이다. 그렇기 때문에 한번에 많은 작업을 GPU에게 할당하여 CPU 바운드를 피할 수 있다.

# Batch, Batch, Batch!

Batch는 일괄적으로 어떤 데이터들을 처리하는 것을 의미한다. 랜더링에선 Batch를 통해 여러 버텍스를 GPU가 한번에 처리하도록 하여 랜더링으로 인한 프레임 드랍을 피할 수 있다.

Batch로 인해 GPU 처리 속도 저하를 걱정할 수 있지만 [Nvidia의 Batch에 관한 문서](https://www.nvidia.com/docs/IO/8228/BatchBatchBatch.pdf)를 참고한다면 그런 걱정은 기우라는 것을 알 수 있다. 요약해서 설명하자면 Batch 처리되는 버택스의 수 보다 한 프레임당 불리는 Batch 콜(드로우 콜)의 수가 프레임 레이트에 더 큰 영향을 미친다.

그렇다면 2D Sprite Batch 처리를 어떻게 구현할 수 있는지 OpenGL를 사용하여 알아보자.

## OpenGL의 Batch Draw

OpenGL에서 랜더링을 위해선 Primitive 타입을 지정해야한다. 각 타입에 따라 랜더링을 위해 건네주는 버텍스의 정보들이 화면에 그려지는 방식을 정할 수 있다.

### Primitive 타입

![batch-01](https://user-images.githubusercontent.com/18159012/44219087-2021b580-a1b6-11e8-8eb1-f10eba7ff06e.png)

위의 그림을 참고하면 어떻게 랜더링 되는지 알 수 있을 것이다. Sprite는 사각형으로 그려지고 Sprite Batch는 각 사각형이 떨어진 위치에 있더라도 한번의 드로우 콜로 화면에 그려져야 되기 때문에 `GL_TRIANGLES` 타입을 지정해야 한다.

Sprite 랜더링을 위해 삼각형 두개를 합쳐 사각형을 만들어야한다. 각 점을 나타내는 버텍스와 버텍스의 순서를 나타내는 인덱스를 통해 사각형을 그린다.

```java
public void setVertices() {
    vertices = new float[] { // x, y, z
        -0.5f, -0.5f, 0.0f,
        0.5f, -0.5f, 0.0f,
        0.5f, 0.5f, 0.0f,
        -0.5f, 0.5f, 0.0f
    }
}

public void setIndices() {}
    indices = new short[] {
        0, 1, 2, 2, 3, 0
    }
}
```

사각형을 만들었다면 이제 텍스처를 사용하여 Sprite를 랜더링해야한다. 이를 위해 텍스처 위의 좌표값을 나타내는 UV를 추가하여 텍스처를 Sprite로 랜더링한다. 

```java
public void setVertices() {
    vertices = new float[] { // x, y, z, u, v
        -0.5f, -0.5f, 0.0f, 0.0f, 1.0f,
        0.5f, -0.5f, 0.0f, 1.0f, 1.0f,
        0.5f, 0.5f, 0.0f, 1.0f, 0.0f,
        -0.5f, 0.5f, 0.0f, 0.0f, 0.0f,
    }
}

public void setIndices() {}
    indices = new short[] {
        0, 1, 2, 2, 3, 0
    }
}
```

### 텍스처 아틀라스

Primitive 타입 지정을 통해 떨어진 위치에 있는 사각형, 즉 Sprite를 화면에 랜더링할 수 있다. 하지만 각 스프라이트가 다른 텍스처를 사용한다면 Batch 처리를 할 수 없다. Batch 처리를 위해 버텍스, UV 그리고 인덱스를 한번에 전달해야 하는데, UV는 텍스처에 대한 정보를 갖지 않고 GL 메서드에 의해 바인딩된 텍스처를 사용하기 때문이다.

이를 해결하기 위해 Batch 처리가 필요한 텍스처들을 하나로 묶은 Sprite 아틀라스를 만들어야한다. 랜더링 되는 텍스처가 하나로 묶여있다면 바인딩된 텍스처를 UV를 통해 한 Sprite에 대한 텍스처 영역을 랜더링할 수 있다.

### 예시

```java
public class SpriteBatcher {
    ...
    public SpriteBatcher(int maxSprite) {
        ...
        short[] indices = new short[maxSprites * 6];
        int len = indices.length;
        short j = 0;
        for (int i = 0; i < len; i += 6, j += 4) {
            indices[i + 0] = (short) (j + 0);
            indices[i + 1] = (short) (j + 1);
            indices[i + 2] = (short) (j + 2);
            indices[i + 3] = (short) (j + 2);
            indices[i + 4] = (short) (j + 3);
            indices[i + 5] = (short) (j + 0);
        }
    }
    
    public void beginBatch(Texture texture) {
        ...
        texture.bind();
    }
    
    public void draw(Sprite sprite, float width, float height, float x, float y, float z) {
        float halfWidth = width / 2;
        float halfHeight = height / 2;

        float x1 = x - halfWidth;
        float y1 = y - halfHeight;
        float x2 = x + halfWidth;
        float y2 = y + halfHeight;

        verticesBuffer[bufferIndex++] = x1;
        verticesBuffer[bufferIndex++] = y1;
        verticesBuffer[bufferIndex++] = z;
        verticesBuffer[bufferIndex++] = sprite.u1;
        verticesBuffer[bufferIndex++] = sprite.v2;

        verticesBuffer[bufferIndex++] = x2;
        verticesBuffer[bufferIndex++] = y1;
        verticesBuffer[bufferIndex++] = z;
        verticesBuffer[bufferIndex++] = sprite.u2;
        verticesBuffer[bufferIndex++] = sprite.v2;

        verticesBuffer[bufferIndex++] = x2;
        verticesBuffer[bufferIndex++] = y2;
        verticesBuffer[bufferIndex++] = z;
        verticesBuffer[bufferIndex++] = sprite.u2;
        verticesBuffer[bufferIndex++] = sprite.v1;

        verticesBuffer[bufferIndex++] = x1;
        verticesBuffer[bufferIndex++] = y2;
        verticesBuffer[bufferIndex++] = z;
        verticesBuffer[bufferIndex++] = sprite.u1;
        verticesBuffer[bufferIndex++] = sprite.v1;

        numSprites++;
    }
    
    public void endBatch() {
        ...
        gl.glDrawArrays(primitiveType, offset, numSprite * 6);
        ...
    }
}
```

