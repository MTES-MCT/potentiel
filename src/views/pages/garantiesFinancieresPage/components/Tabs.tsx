import React, { ChangeEvent, PropsWithChildren, ReactElement } from 'react'
import { TabProps } from './Tab'

type TabsProps = {
  activeKey: string
  name: string
  onSelect?: (key: string) => void
  children: React.ReactNode
}

export const Tabs = ({ activeKey, name, onSelect, children }: TabsProps) => (
  <div className="navigation-tabs">
    {React.Children.map(children, (child: ReactElement<PropsWithChildren<TabProps>>, index) => {
      const {
        props: { children: tabChildren, tabKey },
      } = child

      const tabId = `navigation-tabs-${name}-tab-${index}-${tabKey}`

      const handleInpuOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value
        onSelect && onSelect(key)
      }

      return (
        <div className="tab">
          <input
            type="radio"
            name={name}
            id={tabId}
            value={tabKey}
            checked={activeKey === tabKey}
            onChange={handleInpuOnChange}
          />
          <label htmlFor={tabId}>{tabChildren}</label>
        </div>
      )
    })}
  </div>
)
