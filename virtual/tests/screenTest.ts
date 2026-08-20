//@ts-nocheck
export default async function test() {
    let win = new BasicWindow(120, 50, [1, 1])
    win.fillBorder(display.black)
    win.drawTextAt(
        [2, 2],
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    )

    windows.render()
    display.render()
    api.renderScreen()
}
