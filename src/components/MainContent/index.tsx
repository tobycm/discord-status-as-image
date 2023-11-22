import { isMobile } from '@/utils/tools';
import {
  Box,
  Button,
  Image,
  NativeSelect,
  NumberInput,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MainContent = () => {
  const [userID, setUserID] = useState<Number | null>(null);
  const [link, setLink] = useState('');
  const [tail, setTail] = useState('');
  const form = useForm({
    initialValues: {
      userID: null as Number | null,
      colorMode: 'Single',
      backgroundSingle: '',
      backgroundGradient1: '',
      backgroundGradient2: '',
      backgroundGradientAngle: 0,
    },
  });

  const [colorMode, setColorMode] = useState('Single');

  function copiedNotification() {
    notifications.show({
      title: 'Copied!',
      message: 'Copied to clipboard',
      color: 'teal',
      icon: null,
      autoClose: 2000,
    });
  }

  const column1 = (
    <Table.Td h="100%">
      <iframe
        src="https://discord.com/widget?id=1174576233581912074&theme=dark"
        style={{ width: '90%', height: '90%', border: 'none', minHeight: '300px' }}
      />
    </Table.Td>
  );

  const column2 = (
    <Table.Td display={'flex'} style={{ alignItems: 'start', flexDirection: 'column' }}>
      <Box
        component="form"
        onSubmit={form.onSubmit(() => {
          const newTail =
            colorMode == 'Gradient'
              ? `bg1=${form.values.backgroundGradient1.replace(
                  '#',
                  ''
                )}&bg2=${form.values.backgroundGradient2.replace('#', '')}&angle=${
                  form.values.backgroundGradientAngle
                }`
              : form.values.backgroundSingle
                ? `bg=${form.values.backgroundSingle.replace('#', '')}`
                : '';
          setTail(newTail);
          setUserID(form.values.userID);
          setLink(
            `https://disi-api.bennynguyen.us/smallcard/${form.values.userID}?${newTail}` // disi-api
          );
        })}
        w="90%"
      >
        <NumberInput
          {...form.getInputProps('userID')}
          withAsterisk
          required
          id="disi-userid"
          label="User ID"
          min={1e16}
          max={1e18 - 1}
          hideControls
          clampBehavior="strict"
          placeholder="Enter your User ID"
          onChange={(e) => {
            form.setValues({
              ...form.values,
              userID: e as number,
            });
          }}
        />
        <Box mt="xl">
          <Title order={4}>Background color</Title>
          <NativeSelect
            {...form.getInputProps('colorMode')}
            label="Color mode"
            data={['Single', 'Gradient']}
            onChange={(e) => {
              setColorMode(e.currentTarget.value);
              form.setValues({
                ...form.values,
                backgroundGradient1: '',
                backgroundGradient2: '',
                backgroundGradientAngle: 0,
                backgroundSingle: '',
              });
              form.setFieldValue('colorMode', e.currentTarget.value);
            }}
          />
          {colorMode === 'Single' ? (
            <TextInput
              placeholder="#2B2D31"
              description="Leave blank for default Discord color"
              label="Color"
              {...form.getInputProps('backgroundSingle')}
              maxLength={7}
              minLength={7}
              onChange={(e) => {
                if (
                  /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                  e.currentTarget.value === ''
                ) {
                  const finalValue = e.currentTarget.value.toUpperCase();
                  form.setValues({
                    ...form.values,
                    backgroundSingle: finalValue,
                  });
                }
              }}
            />
          ) : (
            <Box display={'flex'} style={{ justifyContent: 'space-between' }} w="100%">
              <TextInput
                placeholder="#1E1E1E"
                label="Gradient 1"
                {...form.getInputProps('backgroundGradient1')}
                maxLength={7}
                minLength={7}
                required
                onChange={(e) => {
                  if (
                    /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                    e.currentTarget.value === ''
                  ) {
                    const finalValue = e.currentTarget.value.toUpperCase();
                    form.setValues({
                      ...form.values,
                      backgroundGradient1: finalValue,
                    });
                  }
                }}
              />
              <TextInput
                placeholder="#FFFFFF"
                pl={10}
                pr={10}
                label="Gradient 2"
                {...form.getInputProps('backgroundGradient2')}
                maxLength={7}
                minLength={7}
                required
                onChange={(e) => {
                  if (
                    /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                    e.currentTarget.value === ''
                  ) {
                    const finalValue = e.currentTarget.value.toUpperCase();
                    form.setValues({
                      ...form.values,
                      backgroundGradient2: finalValue,
                    });
                  }
                }}
              />
              <NumberInput
                placeholder="0"
                label="Angle"
                {...form.getInputProps('backgroundGradientAngle')}
                allowDecimal={false}
                clampBehavior="strict"
                max={360}
                min={0}
                required
                onChange={(e) => {
                  form.setValues({
                    ...form.values,
                    backgroundGradientAngle: e as number,
                  });
                }}
              />
            </Box>
          )}
        </Box>
        <Button type="submit" mt="xl">
          Generate
        </Button>
        <Text mt="md" size="sm">
          It may take a while for the image to be loaded.
        </Text>
      </Box>
    </Table.Td>
  );

  const column3 = (
    <Table.Td>
      {link !== '' ? (
        <Box display={'flex'} style={{ flexDirection: 'column' }}>
          <a href={`https://discord.com/users/${userID}`} target="_blank">
            <Image src={link} mb="md" />
          </a>
          <UnstyledButton
            mb="md"
            onClick={async () => {
              await navigator.clipboard.writeText(link);
              copiedNotification();
            }}
          >
            🔗 Copy Image URL
          </UnstyledButton>
          <UnstyledButton
            mb="md"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `<a href="https://discord.com/users/${userID}" target="_blank"><img src=${link}></img></a>`
              );
              copiedNotification();
            }}
          >
            🔗 Copy Anchor (image)
          </UnstyledButton>
          <UnstyledButton mb="md">
            <Link
              to={`/smallcard?id=${userID}&${tail}`}
              target="_blank"
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <UnstyledButton>🔴 View live card</UnstyledButton>
            </Link>
          </UnstyledButton>
          <UnstyledButton
            onClick={async () => {
              await navigator.clipboard.writeText(
                `<iframe
                src=https://disi.bennynguyen.us/smallcard?id=${userID}&${tail}
                name="disi-small-card"
                scrolling="no"
                frameborder="0"
                marginheight="0px"
                marginwidth="0px"
                height="450px"
                width="1350px"
              ></iframe>`
              );
              copiedNotification();
            }}
          >
            🔗 Copy iframe
          </UnstyledButton>
        </Box>
      ) : (
        <Text>Complete the previous steps correctly and your cards will show here!</Text>
      )}
    </Table.Td>
  );

  const pcTable = (
    <Table w="95%" h="90%" style={{ fontSize: '30px' }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="33%">Step 1 - Join the Discord Server</Table.Th>
          <Table.Th w="33%">Step 2 - Enter your User ID</Table.Th>
          <Table.Th w="33%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          {column1}
          {column2}
          {column3}
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );

  const mobileTable = (
    <Table w="95%" h="90%" style={{ fontSize: '30px' }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 1 - Join the Discord Server</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column1}</Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 2 - Enter your User ID</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column2}</Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column3}</Table.Tr>
      </Table.Tbody>
    </Table>
  );

  return isMobile ? mobileTable : pcTable;
};

export default MainContent;
