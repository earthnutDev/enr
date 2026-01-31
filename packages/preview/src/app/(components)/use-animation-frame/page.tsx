'use client';

import { _en, useAnimationFrame } from 'enr';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { xcn } from 'xcn';
import { dog, dun } from 'zza/log';

const Example = styled.div`
  box-shadow: 1px 1px 24px #0f06;
  padding: 3rem;
  border-radius: 28px;
  color: #6f3;
`;

/**  测试使用关键帧  */
export default function UseAnimationFramePage() {
  const [data, setData] = useState({
    state: false,
    time1: 0,
    time2: 0,
  });

  const cancelAnimation = useAnimationFrame((a, b) => {
    setData({
      state: data.state,
      time1: Math.floor(a),
      time2: Math.floor(b),
    });
  });

  /**  更改状态  */
  function changeState() {
    const nextState = !cancelAnimation.canceled;
    setData({
      state: !data.state,
      time1: data.time1,
      time2: data.time2,
    });
    if (dun) {
      dog(data);
    }

    if (nextState) {
      if (dun) {
        dog('终止');
      }
      cancelAnimation.cancel();
    } else {
      if (dun) {
        dog('启动');
      }

      cancelAnimation.render();
    }
  }

  const testData = useRef(false);

  useEffect(() => {
    if (dun) {
      dog('i am coming ', testData.current);
    }

    return () => ((testData.current = true), undefined);
  }, []);

  return (
    <Example
      className={xcn(_en('center', 'center', 'text-center', 'cursor-pointer'))}
      onClick={changeState}
      style={{
        backgroundColor: data.state ? 'var(--en-color-red-40)' : 'var(--en-color-darkness-90)',
      }}
    >
      <div>{data.state ? 'run' : 'stop'}</div>
      <div>浏览器公用渲染时间 {data.time1}</div>
      <div>关键帧运行时间 {data.time2}</div>
      <div>时间差 {data.time1 - data.time2}</div>
    </Example>
  );
}
