#!/bin/bash

rm icons/*.png

inkscape -z -e ./icons/icon-16.png -w 16 -h 16 ./icons/icon.svg
inkscape -z -e ./icons/icon-32.png -w 32 -h 32 ./icons/icon.svg
inkscape -z -e ./icons/icon-48.png -w 48 -h 48 ./icons/icon.svg
