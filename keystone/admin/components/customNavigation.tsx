import { NavigationContainer, NavItem, ListNavItems } from '@keystone-6/core/admin-ui/components';
import type { NavigationProps } from '@keystone-6/core/admin-ui/components';
import React from 'react';

export function CustomNavigation({ authenticatedItem, lists }: NavigationProps) {
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">Панель управления</NavItem>
      <ListNavItems lists={lists} />

      {/* custom pages ---->>> */}
      <NavItem href="/custom-page">Custom Page</NavItem>
    </NavigationContainer>
  );
}
