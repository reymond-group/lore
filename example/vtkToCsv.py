#!/usr/bin/python
import sys
import meshio

if len(sys.argv) < 3:
    print('Please specify a file to convert as well as the output file as arguments.\n')
    print('Example: python nrrdToCsv.py input.nrrd output.csv\n')
    sys.exit(0)


points, cells, point_data, cell_data, field_data = meshio.read(sys.argv[1])
print(points)