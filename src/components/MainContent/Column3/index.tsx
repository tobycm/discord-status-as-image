import {
  Box,
  Combobox,
  Divider,
  Image,
  Input,
  InputBase,
  Loader,
  Mark,
  Table,
  Text,
  Title,
  useCombobox,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { disiAPI, testing, web } from '../../../env/env';

const MainContentColumn3 = ({
  smallCardLink,
  largeCardLink,
  smallTail,
  largeTail,
  userID,
  wantLargeCard,
  customBannerMode,
  copiedNotification,
}: {
  smallCardLink: string;
  largeCardLink: string;
  smallTail: string;
  largeTail: string;
  userID: string;
  wantLargeCard: boolean;
  customBannerMode: string;
  copiedNotification: () => void;
}) => {
  const comboboxForSmallCard = useCombobox({
    onDropdownClose: () => comboboxForSmallCard.resetSelectedOption(),
  });

  const comboboxForLargeCard = useCombobox({
    onDropdownClose: () => comboboxForLargeCard.resetSelectedOption(),
  });

  const [smallCardValue, setSmallCardValue] = useState<string | null>(null);
  const [largeCardValue, setLargeCardValue] = useState<string | null>(null);

  useEffect(() => {
    setSmallCardValue(null);
    setLargeCardValue(null);
  }, [smallTail, largeTail]);

  const smallCardOptions = [
    {
      value: '🔗 Copy Image URL (.png)',
      execute: () => {
        navigator.clipboard.writeText(smallCardLink);
        copiedNotification();
      },
    },
    {
      value: '🔗 Copy Anchor (.png)',
      execute: () => {
        navigator.clipboard.writeText(
          `<a href="https://discord.com/users/${userID}" target="_blank"><img width="300px" height="100px" src="${smallCardLink}"></img></a>`
        );
        copiedNotification();
      },
    },
    {
      value: '🔗 Copy Image URL (.svg)',
      execute: () => {
        navigator.clipboard.writeText(
          `${testing ? disiAPI.dev : disiAPI.prod}/smallcard_svg/${userID}?${smallTail}`
        );
        copiedNotification();
      },
    },
    {
      value: '🔗 Copy Markdown (.svg)',
      execute: () => {
        navigator.clipboard.writeText(
          `[![My Discord](${testing ? disiAPI.dev : disiAPI.prod}/smallcard_svg/${userID}?${smallTail})](https://discord.com/users/${userID})`
        );
        copiedNotification();
      },
    },
    {
      value: '🔗 Copy iframe (live card)',
      execute: () => {
        navigator.clipboard.writeText(
          `<iframe src="${testing ? web.dev : web.prod}/smallcard?id=${userID}${smallTail}" name="disi-small-card" height="100px" width="300px"></iframe>`
        );
        copiedNotification();
      },
    },
    {
      value: '🌐 View live card',
      execute: () => {
        window.open(`/smallcard?id=${userID}${smallTail}`, '_blank');
      },
    },
  ];

  const smallCardComboboxOptions = smallCardOptions.map((option) => (
    <Combobox.Option value={option.value} key={option.value} onClick={option.execute}>
      {option.value}
    </Combobox.Option>
  ));

  const largeCardOptions = [
    {
      value: '🔗 Copy Image URL (.png)',
      execute: () => {
        navigator.clipboard.writeText(largeCardLink);
        copiedNotification();
      },
    },
    {
      value: '🔗 Copy Anchor (.png)',
      execute: () => {
        navigator.clipboard.writeText(
          `<a href="https://discord.com/users/${userID}" target="_blank"><img width="300px" height="219.7px" src="${largeCardLink}"></img></a>`
        );
        copiedNotification();
      },
    },
    {
      value: '🔗 Copy iframe (live card)',
      execute: () => {
        navigator.clipboard.writeText(
          `<iframe src="${testing ? web.dev : web.prod}/largecard?id=${userID}${largeTail}" name="disi-large-card" height="219.7px" width="300px"></iframe>`
        );
        copiedNotification();
      },
    },
    {
      value: '🌐 View live card',
      execute: () => {
        window.open(`/largecard?id=${userID}${largeTail}`, '_blank');
      },
    },
    {
      value: '🔗 Copy Image URL (.svg) - Unsupported',
      execute: () => {},
    },
    {
      value: '🔗 Copy Markdown (.svg) - Unsupported',
      execute: () => {},
    },
  ];

  const largeCardComboboxOptions = largeCardOptions.map((option) => (
    <Combobox.Option
      value={option.value}
      key={option.value}
      disabled={option.value.includes('.svg')}
      onClick={option.execute}
    >
      {option.value}
    </Combobox.Option>
  ));

  const [smallCardLoading, setSmallCardLoading] = useState(true);
  const [largeCardLoading, setLargeCardLoading] = useState(true);

  useEffect(() => {
    setSmallCardLoading(true);
    document.getElementById('small-card-image')?.setAttribute('style', 'display: none');
  }, [smallCardLink]);

  useEffect(() => {
    setLargeCardLoading(true);
    document.getElementById('large-card-image')?.setAttribute('style', 'display: none');
  }, [largeCardLink]);

  return (
    <Table.Td>
      {smallCardLink !== '' ? (
        <Box
          display="flex"
          style={{ flexDirection: 'column', alignItems: 'start' }}
          h="100%"
          mt="xl"
        >
          <Box display="flex" style={{ flexDirection: 'column' }} mb="lg">
            <Title order={4} mb="md">
              Small card
            </Title>
            {smallCardLoading && <Loader color="white" size="lg" my="md" />}
            <a href={`https://discord.com/users/${userID}`} target="_blank" rel="noreferrer">
              <Image
                id="small-card-image"
                src={smallCardLink}
                mb="md"
                onLoad={() => {
                  setSmallCardLoading(false);
                  document
                    .getElementById('small-card-image')
                    ?.setAttribute('style', 'display: block');
                }}
                style={{ display: 'none' }}
              />
            </a>
            <Combobox
              store={comboboxForSmallCard}
              onOptionSubmit={(val) => {
                setSmallCardValue(val);
                comboboxForSmallCard.closeDropdown();
              }}
            >
              <Combobox.Target>
                <InputBase
                  label="Choose what to do with the Small card"
                  component="button"
                  type="button"
                  pointer
                  rightSection={<Combobox.Chevron />}
                  rightSectionPointerEvents="none"
                  onClick={() => comboboxForSmallCard.toggleDropdown()}
                >
                  {smallCardValue || <Input.Placeholder>Select action</Input.Placeholder>}
                </InputBase>
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>{smallCardComboboxOptions}</Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </Box>
          {wantLargeCard && largeCardLink && (
            <Box display="flex" style={{ flexDirection: 'column' }}>
              <Divider mb="xl" mt="lg" />
              <Title order={4} mb="md">
                Large card
              </Title>
              {customBannerMode === 'upload' && largeCardLink.includes('bannerID=') && (
                <>
                  <Text>
                    Banner ID ={' '}
                    <Mark color="blue">
                      {largeCardLink.substring(
                        largeCardLink.indexOf('bannerID=') + 9,
                        largeCardLink.indexOf('bannerID=') + 24
                      )}
                    </Mark>
                  </Text>
                  <Text mb="md" style={{ fontSize: '15px' }}>
                    Save this ID somewhere for later use.
                  </Text>
                </>
              )}
              {largeCardLoading && <Loader color="white" size="lg" my="md" />}
              <a href={`https://discord.com/users/${userID}`} target="_blank" rel="noreferrer">
                <Image
                  id="large-card-image"
                  src={largeCardLink}
                  mb="md"
                  onLoad={() => {
                    setLargeCardLoading(false);
                    document
                      .getElementById('large-card-image')
                      ?.setAttribute('style', 'display: block');
                  }}
                  style={{ display: 'none' }}
                />
              </a>
              <Combobox
                store={comboboxForLargeCard}
                onOptionSubmit={(val) => {
                  setLargeCardValue(val);
                  comboboxForLargeCard.closeDropdown();
                }}
              >
                <Combobox.Target>
                  <InputBase
                    label="Choose what to do with the Large card"
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => comboboxForLargeCard.toggleDropdown()}
                  >
                    {largeCardValue || <Input.Placeholder>Select action</Input.Placeholder>}
                  </InputBase>
                </Combobox.Target>
                <Combobox.Dropdown>
                  <Combobox.Options>{largeCardComboboxOptions}</Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
              <Text mt="sm" style={{ fontSize: '15px' }}>
                The size of the iframe and anchor image is pre-determined to be 300.0 x 219.7 (px).
                You probably will need to change it to fit your needs.
              </Text>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Text>Complete the previous steps correctly and your card(s) will show here!</Text>
          <Text>It may take a while for the image(s) to be loaded.</Text>
        </Box>
      )}
    </Table.Td>
  );
};

export default MainContentColumn3;
