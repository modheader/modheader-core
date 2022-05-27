<script>
  import Drawer, { Content } from '@smui/drawer';
  import MenuSurface from '@smui/menu-surface';
  import List, { Item, Text, Separator } from '@smui/list';
  import {
    mdiContentCopy,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked,
    mdiClose,
    mdiHelpCircleOutline,
    mdiThumbUpOutline,
    mdiSortAscending,
    mdiSortDescending,
    mdiChevronLeft,
    mdiMenu,
    mdiFilePlus,
    mdiArrowUp,
    mdiArrowDown
  } from '@mdi/js';
  import { fade } from 'svelte/transition';
  import LockIcon from './LockIcon.svelte';
  import MdiIcon from './MdiIcon.svelte';
  import ProfileBadge from './ProfileBadge.svelte';
  import {
    addProfile,
    removeProfile,
    selectProfile,
    cloneProfile,
    selectedProfile,
    updateProfile,
    sortProfiles,
    swapProfile
  } from '../js/profile.js';
  import { profiles } from '../js/datasource.js';
  import { PRIMARY_COLOR } from '../js/constants.js';
  import { showUpgradeRequired } from '../js/dialog.js';
  import { isProUser } from '../js/identity.js';
  import { showMessage } from '../js/toast.js';
  import { CURRENT_BROWSER } from '../js/user-agent.js';

  let drawer;
  let drawerOpen = true;
  let expand = false;
  let sortOrder = 'asc';
  let contextMenu;
  let contextMenuAnchor;
  let selectedProfileIndex;

  function showMenu(event, { profileIndex }) {
    contextMenu.setOpen(false);
    setTimeout(() => {
      selectedProfileIndex = profileIndex;
      contextMenuAnchor = event.target;
      contextMenu.setIsHoisted(true);
      contextMenu.setOpen(true);
    }, 0);
    event.preventDefault();
  }

  function openLink(url) {
    chrome.tabs.create({ url });
  }
</script>

<Drawer
  class="main-drawer {expand ? 'main-drawer-expand' : 'main-drawer-collapsed'}"
  variant="dismissible"
  bind:this={drawer}
  bind:open={drawerOpen}
>
  <Content class="main-drawer {expand ? 'main-drawer-expand' : 'main-drawer-collapsed'}">
    <List class="main-drawer-list">
      <Item
        class="main-drawer-item"
        title={expand ? 'Hide navigation' : 'Show navigation'}
        on:click={() => {
          expand = !expand;
        }}
      >
        <span class="main-drawer-icon-container">
          <MdiIcon
            size="24"
            class="main-drawer-icon"
            icon={expand ? mdiChevronLeft : mdiMenu}
            color={PRIMARY_COLOR}
          />
        </span>
      </Item>
      <Separator nav />

      <div class="profiles-list">
        {#each $profiles as profile, profileIndex}
          <Item
            class="main-drawer-item"
            title={profile.title}
            selected={$selectedProfile === profile}
            on:contextmenu={(e) => {
              showMenu(e, { profile, profileIndex });
            }}
            on:click={() => {
              selectProfile(profileIndex);
              expand = false;
            }}
          >
            <ProfileBadge {profile} />
            <Text class="main-drawer-item-text">{profile.title}</Text>
          </Item>
        {/each}
        <Item
          class="main-drawer-item"
          title={$profiles.length >= 3 && !$isProUser
            ? 'Upgrade to Pro to add more profiles'
            : 'Add profile'}
          on:click={() => {
            if ($profiles.length >= 3 && !$isProUser) {
              showUpgradeRequired(
                `You already have ${$profiles.length} profiles. Upgrade to Pro to add more profiles!`
              );
            } else {
              addProfile();
              expand = false;
            }
          }}
        >
          <span class="main-drawer-icon-container">
            <MdiIcon size="24" class="main-drawer-icon" icon={mdiFilePlus} color={PRIMARY_COLOR} />
          </span>
          <Text class="main-drawer-item-text">Add profile</Text>
          {#if $profiles.length >= 3}
            <span class="pro-feature-lock">
              <LockIcon />
            </span>
          {/if}
        </Item>
        <Item
          class="main-drawer-item"
          title="Sort profiles"
          on:click={() => {
            sortProfiles(sortOrder);
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
          }}
        >
          <span class="main-drawer-icon-container">
            <MdiIcon
              size="24"
              class="main-drawer-icon"
              icon={sortOrder === 'asc' ? mdiSortAscending : mdiSortDescending}
              color={PRIMARY_COLOR}
            />
          </span>
          <Text class="main-drawer-item-text">Sort profiles</Text>
        </Item>
      </div>

      <Separator nav />
      <Item
        class="main-drawer-item"
        title="Rate us"
        on:click={() => openLink('https://modheader.com/review?browser=' + CURRENT_BROWSER)}
      >
        <span class="main-drawer-icon-container">
          <MdiIcon
            size="24"
            class="main-drawer-icon"
            icon={mdiThumbUpOutline}
            color={PRIMARY_COLOR}
          />
        </span>
        <Text class="main-drawer-item-text">Rate us</Text>
      </Item>
      <Item
        class="main-drawer-item"
        title="Help"
        on:click={() => openLink('https://docs.modheader.com/')}
      >
        <span class="main-drawer-icon-container">
          <MdiIcon
            size="24"
            class="main-drawer-icon"
            icon={mdiHelpCircleOutline}
            color={PRIMARY_COLOR}
          />
        </span>

        <Text class="main-drawer-item-text">Help</Text>
      </Item>
    </List>
  </Content>
</Drawer>

<MenuSurface bind:this={contextMenu} bind:anchorElement={contextMenuAnchor} quickOpen>
  <List>
    <Item
      on:SMUI:action={() => {
        const profile = $profiles[selectedProfileIndex];
        const alwaysOn = !profile.alwaysOn;
        selectProfile(selectedProfileIndex);
        updateProfile({ alwaysOn });
        contextMenu.setOpen(false);
        if (alwaysOn) {
          showMessage(`${profile.title} will stay active even when it is not selected`);
        } else {
          showMessage(`${profile.title} will only be active when selected.`);
        }
      }}
    >
      <MdiIcon
        class="more-menu-icon"
        size="24"
        icon={($profiles[selectedProfileIndex] || {}).alwaysOn
          ? mdiCheckboxMarked
          : mdiCheckboxBlankOutline}
        color="#666"
      />
      <Text>Always stay on</Text>
    </Item>
    <Item
      on:SMUI:action={() => {
        addProfile();
        contextMenu.setOpen(false);
      }}
    >
      <MdiIcon class="more-menu-icon" size="24" icon={mdiFilePlus} color="#666" />
      <Text>Add profile</Text>
    </Item>
    <Item
      on:SMUI:action={() => {
        cloneProfile($profiles[selectedProfileIndex]);
        contextMenu.setOpen(false);
      }}
    >
      <MdiIcon class="more-menu-icon" size="24" icon={mdiContentCopy} color="#666" />
      <Text>Clone profile</Text>
    </Item>
    <Item
      on:SMUI:action={() => {
        contextMenu.setOpen(false);
        removeProfile(selectedProfileIndex);
      }}
    >
      <MdiIcon class="more-menu-icon" size="24" icon={mdiClose} color="red" />
      <Text>Delete profile</Text>
    </Item>

    <Separator nav />
    <Item
      on:SMUI:action={() => {
        swapProfile(selectedProfileIndex, selectedProfileIndex + 1);
        contextMenu.setOpen(false);
      }}
      disabled={$profiles.length === 0 || selectedProfileIndex >= $profiles.length - 1}
    >
      <MdiIcon class="more-menu-icon" color="#666" icon={mdiArrowDown} size="24" />
      <Text>Move down</Text>
    </Item>
    <Item
      on:SMUI:action={() => {
        swapProfile(selectedProfileIndex, selectedProfileIndex - 1);
        contextMenu.setOpen(false);
      }}
      disabled={$profiles.length === 0 || selectedProfileIndex === 0}
    >
      <MdiIcon class="more-menu-icon" color="#666" icon={mdiArrowUp} size="24" />
      <Text>Move up</Text>
    </Item>
  </List>
</MenuSurface>

{#if expand}
  <div class="scrim" transition:fade={{ duration: 200 }} on:click={() => (expand = false)} />
{/if}
