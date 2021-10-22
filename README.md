# Dreamer

UI Interface built with Electron to use DeepDaze and VQGAN-CLIP

**[WORK IN PROGRESS]**

## Download

### Windows (.exe)

[Pre-release v0.2.0](https://github.com/eros404/Dreamer/releases/download/v0.2.0/dreamer-win32-x64-0.2.0.zip)

- Download the file
- Unzip it
- Launch dreamer.exe

## Tools included
### Deep Daze

Deep Daze is a simple command line tool for text to image generation using OpenAI's [CLIP](https://github.com/openai/CLIP) [Siren](https://arxiv.org/abs/2006.09661).

It is created by Phil Wang ([@lucidrains](https://github.com/lucidrains)), you can found the source repository [here](https://github.com/lucidrains/deep-daze).

#### Requirements

This will require that you have an **Nvidia GPU or AMD GPU**

- Recommended: 16GB VRAM
- Minimum Requirements: 4GB VRAM (using VERY LOW settings)

### RealSR ncnn Vulkan
Real-World Super-Resolution via Kernel Estimation and Noise Injection (CVPRW 2020) by [@nihui](https://github.com/nihui) ([repository](https://github.com/nihui/realsr-ncnn-vulkan)).

## Project status

- [ ] Deep Daze generation
    - [x] add options explanations
    - [x] with text/image
    - [ ] story mode
    - [x] generation visualization and process status
- [ ] VQGAN+CLIP generation
- [x] Image explorer
    - [x] realsr implementation for upscaling
