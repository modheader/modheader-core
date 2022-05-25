<script>
  import Menu from '@smui/menu';
  import List, { Item, Text } from '@smui/list';
  import Badge from '@smui-extra/badge';
  import { mdiCrown } from '@mdi/js';
  import IconButton from '@smui/icon-button';
  import Button from '@smui/button';
  import {
    signedInUser,
    isProUser,
    goToMyProfiles,
    goToCreateLoginUrl,
    goToMySubscription,
    goToMyAccount,
    signIn,
    signOut
  } from '../js/identity.js';
  import { buttonColor } from '../js/profile.js';
  import MdiIcon from './MdiIcon.svelte';
  import ProfilePicture from './ProfilePicture.svelte';

  let accountMenu;
</script>

{#if $signedInUser}
  <div>
    <IconButton dense title={$isProUser ? 'Pro' : ''} on:click={() => accountMenu.setOpen(true)}>
      <ProfilePicture picture={$signedInUser.picture} />
      {#if $isProUser}
        <Badge position="inset" align="top-end" color="white">
          <MdiIcon icon={mdiCrown} size="14px" color="#eba534" />
        </Badge>
      {/if}
    </IconButton>

    <Menu bind:this={accountMenu} anchorCorner="TOP_LEFT">
      <List>
        <Item on:SMUI:action={() => goToMyAccount()}><Text>My account</Text></Item>
        <Item on:SMUI:action={() => goToCreateLoginUrl()}><Text>Create login URL</Text></Item>
        <Item on:SMUI:action={() => goToMySubscription()}><Text>My subscription</Text></Item>
        <Item on:SMUI:action={() => goToMyProfiles()}><Text>My exported profiles</Text></Item>
        <Item on:SMUI:action={() => signOut()}><Text>Log out</Text></Item>
      </List>
    </Menu>
  </div>
{:else}
  <Button
    style="min-width: fit-content; color: {$buttonColor}"
    on:click={() => signIn()}
    title="Login">Login</Button
  >
{/if}
