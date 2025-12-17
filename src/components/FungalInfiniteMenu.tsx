import { FC } from 'react';
import InfiniteMenu, { type MenuItem } from './InfiniteMenu';
import FungalGrowthEffect from './FungalGrowthEffect';

interface FungalInfiniteMenuProps {
  /** InfiniteMenu的props */
  items?: MenuItem[];
  /** FungalGrowthEffect的配置 */
  fungalConfig?: {
    color?: string;
    maxLineWidth?: number;
    minLineWidth?: number;
    growthSpeed?: number;
    branchProbability?: number;
    maxLines?: number;
    maxLineLength?: number;
    lineLifetime?: number;
    fadeOut?: boolean;
    sensitivity?: number;
    enabled?: boolean;
  };
  /** 是否显示真菌效果，默认true */
  showFungalEffect?: boolean;
}

const FungalInfiniteMenu: FC<FungalInfiniteMenuProps> = ({
  items = [],
  fungalConfig = {},
  showFungalEffect = true,
}) => {
  return (
    <div className="relative w-full h-full">
      <InfiniteMenu items={items} />
      {showFungalEffect && (
        <FungalGrowthEffect
          width="100%"
          height="100%"
          color={fungalConfig.color || '#888888'}
          maxLineWidth={fungalConfig.maxLineWidth || 1.5}
          minLineWidth={fungalConfig.minLineWidth || 0.5}
          growthSpeed={fungalConfig.growthSpeed || 2.0}
          branchProbability={fungalConfig.branchProbability || 0.02}
          maxLines={fungalConfig.maxLines || 800}
          maxLineLength={fungalConfig.maxLineLength || 150}
          lineLifetime={fungalConfig.lineLifetime || 300}
          fadeOut={fungalConfig.fadeOut !== false}
          sensitivity={fungalConfig.sensitivity || 5}
          enabled={fungalConfig.enabled !== false}
          className="absolute top-0 left-0"
        />
      )}
    </div>
  );
};

export default FungalInfiniteMenu;