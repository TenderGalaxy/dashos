# dashos

A better implementation of the DotOS Framework.

## Module Development

It is highly recommended to use the built-in DotOS BloxdVM, which can be accessed via ./testing/runTests.ts. From here, you can write a test for it in ./testing/tests. It is also highly recommended to write modules in TypeScript, and then compile them later into JavaScript.

Structure

- src : source code
    - boot : files required for booting
    - gui : graphical user interface

    wc.ts - world code

    cb.ts - code block

- virtual : testing
    - bloxd : bloxd HLE

        api.ts : main file
        - textures : information about textures and blocks

    - tests : tests to evaluate the code

    runTests.ts : run the tests

TODO:
Write updateDisk.ts
Update gui/windows.ts
Write utils/images/parse.ts
