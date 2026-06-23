'use client';

import styles from './Admin.module.css';
import AdminSidebarButton, { AdminNavbarButton } from './AdminSidebarButton';
import DividerBlock from '../DividerBlock';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import NotificationButton from '../notifications/NotificationButton';
import { UserAvatar } from '../UserAvatar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from 'primereact/button';

export default function AdminSidebar() {
  const { user, userProfile, logout } = useAuth();

  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  if (!userProfile) return;

  return (
    <>
      <div className={expanded ? styles.sidebar : styles.sidebarCollapsed}>
        <div className={styles.sidebarTop}>
          <div className="row space-between">
            {expanded && (
              <Image
                alt="CONEK Logo"
                className="logo-sidebar"
                height={20}
                src="/conek-logo-weiss.svg"
                width={80}
              />
            )}
            <Button
              className="button-square"
              icon={expanded ? 'pi pi-chevron-left' : 'pi pi-chevron-right'}
              onClick={() => setExpanded(!expanded)}
              style={{ border: '1px solid white', color: 'white', padding: 8 }}
              text
            />
          </div>
          <DividerBlock height={2} />
          <div className="row gap-s align-center width-100">
            <div
              className="row gap-s width-100"
              onClick={() => {
                router.push('/admin/profil');
              }}
            >
              <div style={{ width: 32 }}>
                <UserAvatar fontSize={16} height={32} width={32} />
              </div>
              {expanded && (
                <div className="row width-100">
                  <div className="column" style={{ cursor: 'pointer', flexGrow: 1 }}>
                    <span style={{ color: 'white' }}>{userProfile?.user_name_first}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>
                      {userProfile.email}
                    </span>
                  </div>
                  <NotificationButton user={userProfile} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.sidebarContent} style={{ flexGrow: 1 }}>
          <AdminSidebarButton
            collapsed={!expanded}
            icon="pi pi-home"
            label="Dashboard"
            target="/admin"
          />
          <DividerBlock height={1} />
          <label>
            <strong>Kunden</strong>
          </label>
          <AdminSidebarButton
            collapsed={!expanded}
            icon="pi pi-users"
            label="Kunden"
            target="/admin/kunden"
          />
          {userProfile.user_role === 'admin' && (
            <AdminSidebarButton
              collapsed={!expanded}
              icon="pi pi-file-pdf"
              label="Rechnungen"
              target="/admin/rechnungen"
            />
          )}
          <AdminSidebarButton
            collapsed={!expanded}
            icon="pi pi-list"
            label="Aufgaben"
            target="/admin/aufgaben"
          />
          <AdminSidebarButton
            collapsed={!expanded}
            icon="pi pi-calendar-clock"
            label="Tickets"
            target="/admin/tickets"
          />
          <DividerBlock height={1} />
          {userProfile.user_role === 'admin' && (
            <div className="column gap-s">
              {expanded && (
                <label>
                  <strong>Verwaltung</strong>
                </label>
              )}
              <AdminSidebarButton
                collapsed={!expanded}
                icon="pi pi-crown"
                label="Admins"
                target="/admin/admins"
              />
              <AdminSidebarButton
                collapsed={!expanded}
                icon="pi pi-sitemap"
                label="Agenturen"
                target="/admin/agenturen"
              />
              <AdminSidebarButton
                collapsed={!expanded}
                icon="pi pi-chart-bar"
                label="Statistiken"
                target="/admin/statistiken"
              />
              {/* <AdminSidebarButton
                collapsed={!expanded}
                icon="pi pi-envelope"
                label="E-Mails"
                target="/admin/emails"
              />*/}
              {expanded && (
                <Accordion>
                  <AccordionTab
                    contentClassName="accordion-content"
                    headerClassName="accordion-header"
                    headerTemplate={
                      <AdminSidebarButton
                        collapsed={!expanded}
                        icon="pi pi-cog"
                        label="Einstellungen"
                      />
                    }
                  >
                    {/*<AdminSidebarButton
                      collapsed={!expanded}
                      icon="pi pi-envelope"
                      label="E-Mail Vorlagen"
                      target="/admin/einstellungen/emails"
                    />*/}
                    <AdminSidebarButton
                      collapsed={!expanded}
                      icon="pi pi-file"
                      label="Dokumente"
                      target="/admin/einstellungen/dokumente"
                    />
                  </AccordionTab>
                </Accordion>
              )}
            </div>
          )}
        </div>
        <div className={styles.sidebarContent}>
          <AdminSidebarButton
            action={logout}
            collapsed={!expanded}
            icon="pi pi-sign-out"
            label="Abmelden"
          />
        </div>
      </div>
      <div className={styles.navbar}>
        <AdminNavbarButton icon="pi pi-home" label="Dashboard" target="/admin" />
        <AdminNavbarButton icon="pi pi-users" label="Kunden" target="/admin/kunden" />
        <AdminNavbarButton icon="pi pi-list" label="Aufgaben" target="/admin/aufgaben" />
      </div>
    </>
  );
}
