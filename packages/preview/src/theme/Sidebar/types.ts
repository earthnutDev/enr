export type TabListItem = {
  label: string;
  url: string;
  type?: 'link';
};

export type TabItemProps = {
  data: TabListItem;
};

export type TabList = TabListItem[];
