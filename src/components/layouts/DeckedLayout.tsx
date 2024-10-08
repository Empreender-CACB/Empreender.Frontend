import React, { useState } from 'react';
import Header from '@/components/template/Header';
import SidePanel from '@/components/template/SidePanel';
import UserDropdown from '@/components/template/UserDropdown';
import LanguageSelector from '@/components/template/LanguageSelector';
import Notification from '@/components/template/Notification';
import HeaderLogo from '@/components/template/HeaderLogo';
import SecondaryHeader from '@/components/template/SecondaryHeader';
import MobileNav from '@/components/template/MobileNav';
import Search from '@/components/template/Search';
import View from '@/views';
import AjudaAtendimento from '../template/AjudaAtendimento';
import SearchBar from '@/components/template/SearchBar';

const HeaderActionsStart = () => {
  return (
    <>
      <HeaderLogo />
      <MobileNav />
    </>
  );
};

const HeaderActionsEnd = () => {

  return (
    <>
      <AjudaAtendimento hoverable={false} />
      <SearchBar />
      <LanguageSelector />
      <Notification />
      <SidePanel />
      <UserDropdown hoverable={false} />
    </>
  );
};

const DeckedLayout = () => {
  return (
    <div className="app-layout-simple flex flex-auto flex-col min-h-screen">
      <div className="flex flex-auto min-w-0">
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
          <Header
            container={false}
            className="shadow dark:shadow-2xl"
            headerStart={<HeaderActionsStart />}
            headerEnd={<HeaderActionsEnd />}
          />
          <SecondaryHeader contained={false} />
          <View pageContainerType="default" />
        </div>
      </div>
    </div>
  );
};

export default DeckedLayout;
