const bluetooth = await Service.import("bluetooth");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  bluetooth.connect("changed", (value) => {
    // console.log(JSON.stringify(value, null, 2));
  });

  const connectedDevices = (btDevices) => {
    const noDevices = () => {
      return Widget.Box({
        hpack: "start",
        hexpand: true,
        child: Widget.Label({
          class_name: "dim",
          label: "No devices connected",
        }),
      });
    };

    const deviceList = () => {
      return Widget.Box({
        vertical: true,
        children: btDevices.map((dev) =>
          Widget.Box({
            child: Widget.Box({
              children: [
                Widget.Box({
                  hpack: "start",
                  vertical: true,
                  children: [
                    Widget.Box({
                      children: [
                        Widget.Button({
                          child: Widget.Icon(`${dev["icon-name"]}-symbolic`),
                        }),
                        Widget.Label({
                          class_name: "menu-button-name bluetooth",
                          truncate: "end",
                          wrap: true,
                          label: dev.alias,
                        }),
                      ],
                    }),
                    Widget.Box({
                      class_name: "menu-button-name-container status dim",
                      children: [
                        Widget.Label({
                          class_name: "menu-button-name status dim",
                          label: dev.connected
                            ? "Connected"
                            : dev.paired
                              ? "Paired"
                              : "",
                        }),
                      ],
                    }),
                  ],
                }),
                Widget.Box({
                  hpack: "end",
                  expand: true,
                  children: [
                    Widget.Button({
                      class_name: "menu-icon-button unpair bluetooth",
                      child: Widget.Label({
                        tooltip_text: dev.paired ? "unpair" : "pair",
                        class_name: "menu-icon-button-label unpair bluetooth",
                        label: dev.paired ? "" : "",
                      }),
                      on_primary_click: () =>
                        Utils.execAsync(
                          `bluetoothctl ${dev.paired ? "unpair" : "pair"} ${dev.address}`,
                        ).catch((err) =>
                          console.error(
                            `bluetoothctl ${dev.paired ? "unpair" : "pair"} ${dev.address}`,
                            err,
                          ),
                        ),
                    }),
                    Widget.Button({
                      class_name: "menu-icon-button disconnect bluetooth",
                      child: Widget.Label({
                        tooltip_text: dev.connected ? "disconnect" : "connect",
                        class_name:
                          "menu-icon-button-label disconnect bluetooth",
                        label: dev.connected ? "󱘖" : "",
                      }),
                      on_primary_click: () =>
                        Utils.execAsync(
                          `bluetoothctl ${dev.connected ? "disconnect" : "connect"} ${dev.address}`,
                        ).catch((err) =>
                          console.error(
                            `bluetoothctl ${dev.connected ? "disconnect" : "connect"} ${dev.address}`,
                            err,
                          ),
                        ),
                    }),
                    Widget.Button({
                      class_name: "menu-icon-button untrust bluetooth",
                      child: Widget.Label({
                        tooltip_text: dev.trusted ? "untrust" : "trust",
                        class_name: "menu-icon-button-label untrust bluetooth",
                        label: dev.trusted ? "" : "󱖡",
                      }),
                      on_primary_click: () =>
                        Utils.execAsync(
                          `bluetoothctl ${dev.trusted ? "untrust" : "trust"} ${dev.address}`,
                        ).catch((err) =>
                          console.error(
                            `bluetoothctl ${dev.trusted ? "untrust" : "trust"} ${dev.address}`,
                            err,
                          ),
                        ),
                    }),
                    Widget.Button({
                      class_name: "menu-icon-button delete bluetooth",
                      child: Widget.Label({
                        tooltip_text: "delete",
                        class_name: "menu-icon-button-label delete bluetooth",
                        label: "󰆴",
                      }),
                      on_primary_click: () =>
                        Utils.execAsync(
                          `bluetoothctl remove ${dev.address}`,
                        ).catch((err) =>
                          console.error("Bluetooth Remove", err),
                        ),
                    }),
                  ],
                }),
              ],
            }),
          }),
        ),
      });
    };

    return btDevices.length === 0 ? noDevices() : deviceList();
  };

  const renderDevices = (btDevices) => {
    return btDevices
      .filter(
        (device) =>
          device.name !== null &&
          !bluetooth.connected_devices.find(
            (dev) => dev.address === device.address,
          ),
      )
      .map((device) => {
        return Widget.Button({
          class_name: `menu-button bluetooth ${device}`,
          on_primary_click: () => {
            Utils.execAsync(`bluetoothctl connect ${device.address}`).catch(
              (err) =>
                console.error(`bluetoothctl connect ${device.address}`, err),
            );
            Utils.execAsync(`bluetoothctl pair ${device.address}`).catch(
              (err) =>
                console.error(`bluetoothctl pair ${device.address}`, err),
            );
          },
          child: Widget.Box({
            children: [
              Widget.Box({
                hpack: "start",
                children: [
                  Widget.Icon({
                    class_name: bluetooth
                      .bind("connected_devices")
                      .as((btDevices) =>
                        btDevices.find((cd) => cd.alias === device.alias)
                          ? "menu-button-icon active bluetooth"
                          : "menu-button-icon bluetooth",
                      ),
                    icon: `${device["icon-name"]}-symbolic`,
                  }),
                  Widget.Label({
                    class_name: bluetooth
                      .bind("connected_devices")
                      .as((btDevices) =>
                        btDevices.find((cd) => cd.alias === device.alias)
                          ? "menu-button-name active bluetooth"
                          : "menu-button-name bluetooth",
                      ),
                    truncate: "end",
                    wrap: true,
                    label: device.alias,
                  }),
                ],
              }),
              Widget.Box({
                hpack: "end",
                expand: true,
                children: [
                  Widget.Label({
                    class_name: "menu-button-isactive bluetooth",
                    label: bluetooth
                      .bind("connected_devices")
                      .as((btDevices) =>
                        btDevices.find((cd) => cd.alias === device.alias)
                          ? " "
                          : "",
                      ),
                  }),
                ],
              }),
            ],
          }),
        });
      });
  };

  const bluetoothOnModule = () => {
    return Widget.Box({
      vertical: true,
      children: [
        Widget.Box({
          class_name: "menu-active-container bluetooth",
          vertical: true,
          // children: renderActivePlayback(),
        }),
        Widget.Box({
          class_name: "menu-active-container bluetooth",
          vertical: true,
          // children: renderActiveInput(),
        }),
        Widget.Separator({
          class_name: "menu-separator",
        }),
        Widget.Box({
          class_name: "menu-container bluetooth",
          children: [
            Widget.Box({
              vertical: true,
              children: [
                Widget.Box({
                  class_name: "menu-label-container bluetooth",
                  children: [
                    Widget.Box({
                      hpack: "start",
                      child: Widget.Label({
                        class_name: "menu-label bluetooth",
                        label: "Devices",
                      }),
                    }),
                    Widget.Box({
                      hexpand: true,
                      hpack: "end",
                      child: Widget.Button({
                        class_name: "menu-icon-button",
                        on_primary_click: () =>
                          Utils.execAsync(
                            "bluetoothctl --timeout 120 scan on",
                          ).catch((err) =>
                            console.error(
                              "bluetoothctl --timeout 120 scan on",
                              err,
                            ),
                          ),
                        child: Widget.Icon("view-refresh-symbolic"),
                      }),
                    }),
                  ],
                }),
                Widget.Box({
                  vertical: true,
                  children: bluetooth
                    .bind("devices")
                    .as((v) => renderDevices(v)),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  const bluetoothOffModule = () => {
    return Widget.Box({
      class_name: "bluetooth-disabled-menu",
      vertical: true,
      children: [
        Widget.Label({
          hexpand: true,
          vexpand: true,
          label: bluetooth
            .bind("state")
            .as((state) =>
              state === "turning-off"
                ? "Bluetooth is turning off..."
                : "Bluetooth is disabled",
            ),
        }),
      ],
    });
  };
  return DropdownMenu({
    name: "bluetoothmenu",
    transition: "crossfade",
    minWidth: 325,
    child: Widget.Box({
      class_name: "menu-items",
      child: Widget.Box({
        vertical: true,
        class_name: "menu-items-container",
        children: [
          Widget.Box({
            class_name: "menu-dropdown-label-container",
            children: [
              Widget.Box({
                hexpand: true,
                hpack: "start",
                child: Widget.Label({
                  class_name: "menu-dropdown-label bluetooth",
                  label: "Bluetooth",
                }),
              }),
              Widget.Box({
                hexpand: true,
                hpack: "end",
                child: Widget.Switch({
                  class_name: "menu-switch bluetooth",
                  active: bluetooth.enabled,
                  setup: (self) => {
                    bluetooth.connect("changed", ({ enabled }) => {
                      self.set_property("active", enabled);
                    });
                  },
                  on_activate: ({ active }) =>
                    Utils.execAsync(
                      `bluetoothctl power ${active ? "on" : "off"}`,
                    ).catch((err) =>
                      console.error(
                        `bluetoothctl power ${active ? "on" : "off"}`,
                        err,
                      ),
                    ),
                }),
              }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            vertical: true,
            children: bluetooth.bind("enabled").as((isOn) =>
              isOn
                ? [
                    Widget.Box({
                      class_name: "menu-label-container",
                      child: Widget.Label({
                        class_name: "menu-label bluetooth",
                        hpack: "start",
                        label: "My Devices",
                      }),
                    }),
                    Widget.Box({
                      vertical: true,
                      class_name: "menu-item-box",
                      child: bluetooth
                        .bind("connected_devices")
                        .as((btConDevs) => connectedDevices(btConDevs)),
                    }),
                  ]
                : [],
            ),
          }),
          Widget.Box({
            vertical: true,
            child: bluetooth
              .bind("enabled")
              .as((btEnabled) =>
                btEnabled ? bluetoothOnModule() : bluetoothOffModule(),
              ),
          }),
        ],
      }),
    }),
  });
};